const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Configuration
app.use(cors({
    origin: ["https://admission-frontend-seven.vercel.app"],
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

// 2. Body Parser
app.use(express.json());

// 3. MongoDB Connection
// Note: MONGO_URI aapke Vercel Dashboard mein honi chahiye
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
// Note: Kyunke ye file 'api' folder mein hai, toh route ka path careful ho kar set karein
app.get('/api', (req, res) => {
    res.send("Backend server is live and responding!");
});

app.post('/api/admission', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ success: true, message: "Data Saved in MongoDB!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 6. Very Important: Vercel ke liye server ko export karna parta hai
module.exports = app;
