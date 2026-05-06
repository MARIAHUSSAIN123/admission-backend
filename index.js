const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Precise CORS Configuration
app.use(cors({
    origin: "https://admission-frontend-seven.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

// 2. Database Connection with Error Handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log("DB Connection Error: ", err));

// 3. Schema & Model (In the same file for now to avoid path issues)
const Student = mongoose.model('Student', new mongoose.Schema({
    fullName: String,
    email: String,
    course: String,
    phone: String
}));

// 4. Route
app.post('/api/admission', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/', (req, res) => res.send("Live"));

module.exports = app;
