//create user schema for job application portal

const  mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// create user schema for job application portal,

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is requires"],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([._]?\w+)*@\w+([._]?\w+)*(\.\w{2,3})+$/,
            "please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6
    },
    phone: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: Number,
        default: 0
    },
    resume: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["jobseeker", "employer"],
        default: "jobseeker"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// pre-save middleware to hash password
UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);


