require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/programs", require("./routes/programs"));
app.use("/api/applicants", require("./routes/applicants"));
app.use("/api/admissions", require("./routes/admissions"));
app.use("/api/dashboard", require("./routes/dashboard"));

// ✅ FIXED: MONGO_URI → MONGODB_URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));