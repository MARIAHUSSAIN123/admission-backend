const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Student = require('./models/Student');

const app = express();

// Middleware
app.use(express.json());
const cors = require('cors');

// Specific settings for Vercel
const corsOptions = {
    origin: "https://admission-frontend-seven.vercel.app", // Aapka frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Sab routes par OPTIONS request handle karne ke liye// Isse frontend ki requests block nahi hongi

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Admission Form Route
app.post('/api/admission', async (req, res) => {
    try {
        const { fullName, email, course, phone } = req.body;
        
        // Simple validation
        if (!fullName || !email || !course || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newStudent = new Student({ fullName, email, course, phone });
        await newStudent.save();
        
        res.status(201).json({ message: "Admission form submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Health Check Route
app.get('/', (req, res) => {
    res.send("Backend Server is Live!");
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
