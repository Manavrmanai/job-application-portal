const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const path = require('path');
const fs = require('fs');


const router = express.Router();

// register user 

router.post("/register", async (req, res) => {
    try {
        const { name , email , password , phone , role , location , skills , experience } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message : "user already exists"})
        }

        //create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            location: location || "",
            skills: skills || [],
            experience: experience || 0,
            role: role || "jobseeker"
        });

        await user.save();

        //genrate jwt token
        const token = jwt.sign(
            { userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7h" }
        );

        res.status(201).json({
            message: "user registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// login user 
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "invalid credentials"});
        }

        //check passwoed
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({message: "invalid credentials"});
        }

        //generate jwt token
        const token = jwt.sign(
            { userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7h" }
        );

        res.json({
            message: "user logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// upload user resume
router.post("/upload-resume", auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Update user's resume field in database
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { resume: req.file.path },
            { new: true }
        ).select('-password');

        res.json({
            message: "Resume uploaded successfully",
            fileName: req.file.filename,
            filePath: req.file.path,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume,
                hasResume: true
            }
        });

    } catch (error) {
        // Delete uploaded file if database update fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
});

router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                skills: user.skills,
                experience: user.experience,
                role: user.role,
                resume: user.resume,
                hasResume: !!user.resume
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/resume", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user.resume) {
            return res.status(404).json({ message: "No resume found" });
        }

        // Delete file from storage
        if (fs.existsSync(user.resume)) {
            fs.unlinkSync(user.resume);
        }

        // Remove resume path from database
        user.resume = "";
        await user.save();

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting resume", error: error.message });
    }
});


// downlaod user resume
router.get("/:userId/resume", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user || !user.resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Check if file exists
        if (!fs.existsSync(user.resume)) {
            return res.status(404).json({ message: "Resume file not found on server" });
        }

        // Set appropriate headers for download
        const fileName = path.basename(user.resume);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Send file
        res.download(path.resolve(user.resume));

    } catch (error) {
        res.status(500).json({ message: "Error retrieving resume", error: error.message });
    }
});


module.exports = router;