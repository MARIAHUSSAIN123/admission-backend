const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS: Frontend URL ko allow karna zaroori hai
app.use(cors({
    origin: "https://admission-frontend-sksh.vercel.app", 
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Connection Error:", err));

// Test Route
app.get("/", (req, res) => res.send("Server is running..."));

// Admission Form Route
app.post("/api/admission", async (req, res) => {
    try {
        // Aapka Model (Schema) yahan use hoga
        // const student = await Student.create(req.body);
        res.status(201).json({ message: "Form Submitted Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Vercel handles the port, isliye app.listen ki bajaye export zaroori hai
module.exports = app;
