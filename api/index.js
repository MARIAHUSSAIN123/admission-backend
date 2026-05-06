const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ IMPORTANT: CORS simple rakho
app.use(cors({
  origin: "https://admission-frontend-seven.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

// Schema
const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  course: String,
  phone: String
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

// Routes
app.get("/api", (req, res) => {
  res.status(200).send("Backend running");
});

app.post("/api/admission", async (req, res) => {
  await connectDB();

  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ success: true, message: "Form submitted!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ THIS IS THE REAL FIX
module.exports = (req, res) => {
  return app(req, res);
};
