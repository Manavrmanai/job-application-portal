const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    //job
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    //applicant user
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true  
    },
    //coverletter
    coverletter: {
        type: String,
        default: ""
    },
    //status
    status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending"
    },
    //appliedAt
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// prevent duplicate application
ApplicationSchema.index({job:1 , applicant:1}, {unique: true});

//export model
module.exports = mongoose.model("Application", ApplicationSchema);