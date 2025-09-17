// create auth middleware to protect routes

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).send({ message: "no token, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: "Invalid token" });
    }
};

module.exports = auth;