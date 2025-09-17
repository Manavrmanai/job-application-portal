const express = require("express");
const jwt = require("jsonwebtoken");
const Job = require("../models/jobs");
const auth = require("../middleware/auth");
const { create } = require("../models/user");

const router = express.Router();

// create job by employer
router.post("/", auth, async (req, res) => {
    try {
        if(req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied, only employers can create jobs" });
        }
        const { title, company, description, requirements, location, salary, jobtype } = req.body;

        const job = new Job({
            title,
            company,
            description,
            requirements: requirements || [],
            location,
            salary: salary || "",
            jobtype: jobtype || "full-time",
            employer: req.user._id
        });

        await job.save();

        res.status(201).json({ message: "Job created successfully", job });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// update job
router.patch("/:id", auth , async (req , res) => {
    try{
        if(req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied, only employers can update jobs" });  
        }

        const job = await Job.findById(req.params.id);

        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //check job belongs to employer
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied, you can only update your own jobs" });
        }
        
        const updatejob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true , runValidators: true}
        );

        res.json({
            message: "job updated successfully",
            job: updatejob
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// delete job
router.delete("/:id", auth , async (req,res) => {
    try{
        if(req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied, only employers can delete jobs" });
        }
        const job = await Job.findById(req.params.id);
        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //check job belongs to employer
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied, you can only delete your own jobs" });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// employer own jobs
router.get("/employer", auth, async (req, res)=> {
    try {
        if(req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied, only employers can view their jobs" });
        }
        const jobs = await Job.find({ employer: req.user._id}).sort({createdAt: -1});
        res.json({
            message: "jobs retrieved successfully",
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// get all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true })
        .populate("employer", "name email")
        .sort({ createdAt: -1 });

        res.json({
            message: "Jobs retrieved successfully",
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// single job details
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        .populate("employer", "name email phone location");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({
            message: "Job details retrieved successfully",
            job
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// search and filter jobs
router.get("/", async (req, res) => {
    try {
        const { title, location , jobtype, company } = req.query;

        let query = { isActive: true };

        // search queries
        if (title) {
            query.title = { $regex: title, $options: 'i'};
        }
        if (location) {
            query.location = { $regex: location, $options: 'i'};
        }
        if (company) {
            query.company = { $regex: company, $options: 'i'};
        }
        if (jobtype) {
            query.jobtype = jobtype;
        }

        const jobs = await Job.find(query)
        .populate("employer", "name email")
        .sort({ createdAt: -1 });

        res.json({
            message: "Jobs retrieved successfully",
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
});

module.exports = router;