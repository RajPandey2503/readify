const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["PDF", "Article"],
      required: true
    },

    summary: {
      type: String,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Upload", uploadSchema);
