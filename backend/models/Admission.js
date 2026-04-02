const mongoose = require("mongoose");

module.exports = mongoose.model("Admission", new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant" },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  quota: String,
  admissionNumber: String,
  feeStatus: { type: String, default: "Pending" },
  confirmed: { type: Boolean, default: false }
}));
