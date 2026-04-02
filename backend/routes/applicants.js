const router = require("express").Router();
const Applicant = require("../models/Applicant");


// ✅ CREATE APPLICANT
router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      feeStatus: req.body.feeStatus || "Pending",
      documentStatus: req.body.documentStatus || "Pending",
      isConfirmed: false,
    };

    const applicant = await Applicant.create(data);
    res.json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ GET ALL APPLICANTS
router.get("/", async (req, res) => {
  try {
    const data = await Applicant.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { feeStatus, documentStatus } = req.body;
    const updateData = {};

    if (feeStatus) {
      if (!["Pending", "Paid"].includes(feeStatus)) {
        return res.status(400).json({ error: "Invalid fee status" });
      }
      updateData.feeStatus = feeStatus;
    }

    if (documentStatus) {
      if (!["Pending", "Verified", "Rejected"].includes(documentStatus)) {
        return res.status(400).json({ error: "Invalid document status" });
      }
      updateData.documentStatus = documentStatus;
    }

    // ✅ FIXED: Use { new: true }
    const updated = await Applicant.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }  // ← This was broken!
    );

    if (!updated) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/// ✅ ATOMIC CONFIRM - Does EVERYTHING in one call
router.post("/confirm/:id", async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 🔥 SET PREREQUISITES if missing
    if (applicant.feeStatus !== "Paid") {
      applicant.feeStatus = "Paid";
    }
    
    if (applicant.documentStatus !== "Verified") {
      applicant.documentStatus = "Verified";
      console.log('🔧 Auto-set documents to Verified'); 
    }

    if (applicant.isConfirmed) {
      return res.status(400).json({ error: "Already confirmed" });
    }

    // ✅ CONFIRM
    applicant.status = "confirmed";
    applicant.isConfirmed = true;
    applicant.admissionNumber = `INST/2026/${applicant.quota}/${String(applicant._id).slice(-4).padStart(4, "0")}`;

    await applicant.save();

    console.log('✅ Confirmed:', applicant.admissionNumber);
    
    res.json({
      message: "Admission confirmed successfully!",
      admissionNumber: applicant.admissionNumber,
    });
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(400).json({ error: err.message });
  }
});


// ✅ FUTURE READY: DOCUMENT DETAILS UPDATE (ADVANCED)
router.put("/documents/:id", async (req, res) => {
  try {
    const { documents } = req.body;

    const updated = await Applicant.findByIdAndUpdate(
      req.params.id,
      { $set: { documents } },
      { returnDocument: "after" }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;