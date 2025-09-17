const express = require("express");
const Application = require("../models/application");
const Job = require("../models/jobs");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

// apply for a job
router.post("/:jobId", auth, async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only job seekers can apply for jobs" });
        }

        // Check if user has uploaded resume
        if (!req.user.resume) {
            return res.status(400).json({ message: "Please upload your resume first" });
        }

        // Check if job exists
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Create application
        const application = new Application({
            job: req.params.jobId,
            applicant: req.user._id,
            coverletter: req.body.coverletter || ""
        });

        await application.save();

        // Populate job and applicant details
        await application.populate('job', 'title company location');
        await application.populate('applicant', 'name email resume');

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// users application can check status
router.get("/", auth, async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location salary')
            .sort({ appliedAt: -1 });

        res.json({
            message: "Applications retrieved successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// get single application details
router.get("/:id", auth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title company description location salary')
            .populate('applicant', 'name email phone resume');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check if user owns this application or is the employer
        if (application.applicant._id.toString() !== req.user._id.toString() && 
            application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({
            message: "Application details retrieved",
            application
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// get all applications for a specific job (employer only)
router.get("/:jobId/applications", auth, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can view job applications" });
        }

        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only view applications for your own jobs" });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email phone resume skills experience')
            .sort({ appliedAt: -1 });

        res.json({
            message: "Applications retrieved successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//update application status (employer only)
router.patch("/:id/status", auth, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can update application status" });
        }

        const { status } = req.body;
        if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const application = await Application.findById(req.params.id)
            .populate('job', 'employer');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update applications for your own jobs" });
        }

        application.status = status;
        await application.save();

        res.json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;