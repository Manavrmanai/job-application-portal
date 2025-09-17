const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "job title is required"]
    },
    company: {
        type: String,
        required: [true, "company name is required"]
    },
    //description
    description: {
        type: String,
        required: [true, "job description is required"]
    },
    //requirements
    requirements: {
        type: [String],
        default: []
    },
    //location
    location: {
        type: String,
        required: [true, "job location is required"]
    },
    //salary
    salary: {
        type: String,
        default: ""
    },
    //jobtype
    jobtype: {
        type: String,
        enum: ["full-time", "part-time", "contract", "internship"],
        default: "full-time"
    },
    //employer
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    //isactive
    isActive: {
        type: Boolean,
        default: true
    },
    //createdAt
    createdAt: {
        type: Date,
        default: Date.now
    }
});
    //export model
module.exports = mongoose.model("Job", JobSchema)