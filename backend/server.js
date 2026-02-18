require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const Upload = require("./models/Upload");

connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

/* ================= LOGIN ================= */
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (email === "admin@test.com" && password === "1234") {
    const token = jwt.sign(
      { user: "Raj" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Login Successful",
      token
    });
  }

  return res.json({
    success: false,
    message: "Invalid credentials"
  });
});


/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.send("Readify API Running");
});

/* ================= UPLOAD ================= */
app.post("/upload", async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "Missing file name" });
    }

    const newUpload = new Upload({
      fileName,
      type: "Resume",
      summary: "This document appears to be a professional CV."
    });

    await newUpload.save();

    res.json(newUpload);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ================= HISTORY ================= */
app.get("/history", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/* ================= CLEAR HISTORY ================= */
app.delete("/history", async (req, res) => {
  try {
    await Upload.deleteMany({});
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
