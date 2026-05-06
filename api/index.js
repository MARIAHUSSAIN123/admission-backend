const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ SIMPLE & SAFE CORS
app.use(cors({
  origin: "https://admission-frontend-seven.vercel.app"
}));

app.use(express.json());

// ✅ DB connection (Vercel friendly)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Schema
const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  course: String,
  phone: String
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

// Routes
app.get("/api", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/api/admission", async (req, res) => {
  await connectDB();

  try {
    const newStudent = new Student(req.body);
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Form submitted successfully 🎉"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ✅ VERCEL HANDLER (MOST IMPORTANT)
module.exports = (req, res) => {
  app(req, res);
};
