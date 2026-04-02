const router = require("express").Router();
const Program = require("../models/Program");

router.get("/", async (req, res) => {
  const programs = await Program.find();

  let total = 0, filled = 0;

  programs.forEach(p => {
    total += p.intake;
    filled += Object.values(p.filledSeats).reduce((a, b) => a + b, 0);
  });

  res.json({ total, filled, remaining: total - filled });
});

module.exports = router;