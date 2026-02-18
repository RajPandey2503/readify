const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  fileName: String,
  type: String,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Upload", uploadSchema);
