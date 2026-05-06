const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Middleware Configuration
const corsOptions = {
    origin: "https://admission-frontend-sksh.vercel.app", // No trailing slash
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Preflight (OPTIONS) Requests ko handle karne ke liye manual headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://admission-frontend-sksh.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Connection Error:", err));

// Simple Schema (Data save karne ke liye)
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// Routes
app.get("/", (req, res) => res.send("Admission Backend is Live!"));

app.post("/api/admission", async (req, res) => {
    try {
        const { name, email } = req.body;
        const newStudent = await Student.create({ name, email });
        res.status(201).json({ 
            success: true, 
            message: "Form Submitted Successfully!", 
            data: newStudent 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = app;
