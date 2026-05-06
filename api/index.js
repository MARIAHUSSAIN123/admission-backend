const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Middleware (Special for Vercel)
app.use(cors({
    origin: "https://admission-frontend-seven.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

// 2. Manual Header Check (CORS error ka pakka ilaj)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://admission-frontend-seven.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // OPTIONS request ko handle karna zaroori hai
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// 3. MongoDB Connection
// Note: MONGO_URI aapke Vercel Dashboard ki Environment Variables mein honi chahiye
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// 4. Schema & Model
const studentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
});

const Student = mongoose.model('Student', studentSchema);

// 5. API Routes
// Kyunke file api folder mein hai, toh route base URL se start hoga
app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Data Saved!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test route
app.get('/api', (req, res) => {
    res.send("Backend is working on Vercel!");
});

// 6. Export for Vercel (Do NOT use app.listen)
module.exports = app;
