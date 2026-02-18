const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

let uploads = [];

// LOGIN
app.post("/login", (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (email === "admin@test.com" && password === "1234") {
    return res.json({
      success: true,
      message: "Login Successful",
      user: "Raj"
    });
  }

  return res.json({
    success: false,
    message: "Invalid credentials"
  });
});

// HOME
app.get("/", (req, res) => {
  res.send("Readify API Running");
});

// UPLOAD
app.post("/upload", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) return res.json({ error: "Missing file" });

  const result = {
    fileName,
    type: "Resume",
    summary: "This document appears to be a professional CV."
  };

  uploads.push(result);
  res.json(result);
});

// HISTORY
app.get("/history", (req, res) => {
  res.json(uploads);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
