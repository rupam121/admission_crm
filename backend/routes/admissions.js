const router = require("express").Router();
const Program = require("../models/Program");
const Admission = require("../models/Admission");

// allocate
router.post("/allocate", async (req, res) => {
  const { programId, applicantId, quota } = req.body;

  const program = await Program.findById(programId);

  if (program.filledSeats[quota] >= program.quotas[quota]) {
    return res.status(400).json({ error: "Quota Full" });
  }

  const admission = await Admission.create({ programId, applicantId, quota });

  program.filledSeats[quota]++;
  await program.save();

  res.json(admission);
});

// confirm
router.put("/confirm/:id", async (req, res) => {
  const ad = await Admission.findById(req.params.id);

  if (ad.feeStatus !== "Paid") {
    return res.status(400).json({ error: "Fee not paid" });
  }

  ad.admissionNumber = `INST/${Date.now()}`;
  ad.confirmed = true;

  await ad.save();
  res.json(ad);
});

module.exports = router;