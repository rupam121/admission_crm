const router = require("express").Router();
const Program = require("../models/Program");
const auth = require("../middleware/auth");

// Only ADMIN can create program
router.post("/", auth(["admin"]), async (req, res) => {
  const p = await Program.create(req.body);
  res.json(p);
});

// Everyone logged in can view
router.get("/", auth(), async (req, res) => {
  res.json(await Program.find());
});

module.exports = router;