const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: String,
  intake: Number,
  quotas: {
    KCET: Number,
    COMEDK: Number,
    Management: Number
  },
  filledSeats: {
    KCET: { type: Number, default: 0 },
    COMEDK: { type: Number, default: 0 },
    Management: { type: Number, default: 0 }
  }
});

// 🔥 Fix: prevent overwrite error
module.exports =
  mongoose.models.Program ||
  mongoose.model("Program", programSchema);