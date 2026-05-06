const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Setup
app.use(cors({
    origin: "https://admission-frontend-seven.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

// 2. Preflight Header Handler (Sabse Zaroori Step)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://admission-frontend-seven.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Browser jab OPTIONS request bhejta hai toh ye usse 200 return karega
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Error:", err));

// 4. Schema & Model
const studentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

// 5. API Route (Backend endpoint)
app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Data Saved!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test route check karne ke liye
app.get('/api', (req, res) => {
    res.send("Backend server is live!");
});

// 6. Export for Vercel
module.exports = app;
