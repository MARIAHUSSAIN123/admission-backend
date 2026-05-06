const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - Yahan frontend ka URL allow kiya hai
app.use(cors({
    origin: "https://admission-frontend-eight.vercel.app", // Aapka frontend URL
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("Database Connection Error:", err));

// Schema & Model
const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    phone: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Base Route
app.get('/api', (req, res) => {
    res.status(200).send("API is Live and Running!");
});

// Post Admission Route
app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Post Error:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
});

module.exports = app;
