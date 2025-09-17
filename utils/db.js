const mongoose = require("mongoose");

//connect to mongodb
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongoDB connected: ${conn.connection.host}`);
    } catch (error){
        console.error(`error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;