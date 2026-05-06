const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS aur Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Vercel Dashboard mein MONGO_URI lazmi add karein)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("DB Error:", err));

// Student Schema
const Student = mongoose.model('Student', new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
}));

// Routes
app.get('/api', (req, res) => {
    res.send("Backend server is live!");
});

app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Admission successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Vercel ke liye Export lazmi hai
module.exports = app;
