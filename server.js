const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const path = require('path');
const errorHandler = require("./middleware/errorhandler")

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//test Route
app.get("/", (req, res)=> {
    res.json({ message: "job application portal API is running" });
})

app.use('/uploads' , express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", require("./routes/users"));
app.use("/api/jobs", require("./routes/job"));
app.use("/api/applications", require("./routes/applications"));

app.use(errorHandler);

//connect to database
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running on port ${PORT}`);
});