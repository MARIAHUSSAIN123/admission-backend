const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Bilkul Simple CORS (No Restrictions)
app.use(cors()); 

// 2. Manual Headers (Vercel Compatibility)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log("DB Error:", err));

// Model
const Student = mongoose.model('Student', new mongoose.Schema({
    fullName: String, email: String, course: String, phone: String
}));

// Routes
app.get('/api', (req, res) => res.send("API is Live!"));

app.post('/api/admission', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ success: true, message: "Data Saved!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;
