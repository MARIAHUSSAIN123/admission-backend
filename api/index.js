const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Ultimate CORS Configuration
app.use(cors({
    origin: true, // Har origin ko allow karega (Testing ke liye best hai)
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

// 2. Extra Headers for Vercel
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://admission-frontend-seven.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// 3. MongoDB Connection
// Yaad se Vercel dashboard mein MONGO_URI add kariyega
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Connection Error:", err));

// 4. Schema
const studentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

// 5. Routes
// Base route check karne ke liye
app.get('/api', (req, res) => {
    res.status(200).send("Backend is live and running!");
});

// Main Admission Route
app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Admission form submitted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 6. Export for Vercel
module.exports = app;
