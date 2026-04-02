const jwt = require("jsonwebtoken");

module.exports = (roles = []) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // ✅ Extract token safely
    let token;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    // ❌ Invalid token cases
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // ✅ Role check
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "Token not valid" });
  }
};