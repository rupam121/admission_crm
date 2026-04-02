const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ FIXED REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      email, 
      password: hash, 
      role: role || 'officer' 
    });
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    
    res.json({ token, role: user.role }); 
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// ✅ FIXED LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role });  
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;