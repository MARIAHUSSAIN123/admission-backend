const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Configuration (Sabse Pehle)
app.use(cors({
    origin: "https://admission-frontend-seven.vercel.app", // Sirf aapka frontend allowed hai
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

// 2. Preflight (OPTIONS) Request Handler
// Vercel par ye hona lazmi hai varna CORS error kabhi khatam nahi hoga
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://admission-frontend-seven.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

// 4. Student Schema & Model
const studentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

// 5. API Route
app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Admission successful!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health Check
app.get('/', (req, res) => res.send("Server is running..."));

// 6. Vercel Export
module.exports = app;
