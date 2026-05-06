const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Sirf simple cors use karein, headers vercel.json sambhal lega
app.use(cors({
    origin: "https://admission-frontend-seven.vercel.app",
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

const Student = mongoose.model('Student', new mongoose.Schema({
    fullName: String, email: String, course: String, phone: String
}));

app.get('/api', (req, res) => res.send("Live!"));

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
