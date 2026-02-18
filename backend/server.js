require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const Upload = require("./models/Upload");
const User = require("./models/User");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");

/* SAFE PDF PARSE IMPORT */
let pdfParse = require("pdf-parse");
if (pdfParse.default) pdfParse = pdfParse.default;

connectDB();
const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

/* ================= ENSURE UPLOAD FOLDER ================= */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

/* ================= HOME ================= */
app.get("/", (_, res) => {
  res.send("Readify API Running");
});

/* ================= PDF UPLOAD ================= */
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text || "";
    const textToSummarize = rawText.slice(0, 2000);

    let summary = "Summary unavailable.";

    /* ---- AI SUMMARY ---- */
    if (textToSummarize.length > 50 && process.env.HF_API_KEY) {
      try {
        const hf = await axios.post(
          "https://api-inference.huggingface.co/models/google/pegasus-xsum",
          { inputs: textToSummarize },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              "Content-Type": "application/json"
            },
            timeout: 20000
          }
        );

        summary = hf.data?.[0]?.summary_text || summary;
      } catch {
        console.log("HF FAILED → using fallback");
      }
    }

    /* ---- HARD FALLBACK ---- */
    if (summary === "Summary unavailable." && rawText.length > 50) {
      summary = rawText.split(".").slice(0, 3).join(".") + ".";
    }

    const saved = await Upload.create({
      fileName: req.file.originalname,
      type: "PDF",
      summary,
      user: req.userId
    });

    fs.unlinkSync(filePath);
    res.json(saved);

  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

/* ================= URL / ARTICLE READER ================= */
app.post("/read-url", verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url)
      return res.status(400).json({ error: "URL missing" });

    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    $("script, style").remove();

    const rawText = $("body").text().replace(/\s+/g, " ").trim();
    const textToSummarize = rawText.slice(0, 2000);

    let summary = "Summary unavailable.";

    if (textToSummarize.length > 50 && process.env.HF_API_KEY) {
      try {
        const hf = await axios.post(
          "https://api-inference.huggingface.co/models/google/pegasus-xsum",
          { inputs: textToSummarize },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        summary = hf.data?.[0]?.summary_text || summary;
      } catch {
        summary = rawText.split(".").slice(0, 3).join(".") + ".";
      }
    }

    const saved = await Upload.create({
      fileName: url,
      type: "Article",
      summary,
      user: req.userId
    });

    res.json(saved);

  } catch (err) {
    console.error("URL ERROR:", err.message);
    res.status(500).json({ error: "Failed to read URL" });
  }
});

/* ================= HISTORY (USER ONLY) ================= */
app.get("/history", verifyToken, async (req, res) => {
  try {
    const uploads = await Upload
      .find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(uploads);

  } catch {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/* ================= DELETE ONE ================= */
app.delete("/history/:id", verifyToken, async (req, res) => {
  try {
    await Upload.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    res.json({ message: "Deleted successfully" });

  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ================= CLEAR ALL (USER ONLY) ================= */
app.delete("/history", verifyToken, async (req, res) => {
  try {
    await Upload.deleteMany({ user: req.userId });
    res.json({ message: "History cleared" });

  } catch {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
