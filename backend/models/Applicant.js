const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  documentsStatus: {
    type: String,
    enum: ["Pending", "Submitted", "Verified"],
    default: "Pending"
  }, feeStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }
});

module.exports =
  mongoose.models.Applicant ||
  mongoose.model("Applicant", applicantSchema);