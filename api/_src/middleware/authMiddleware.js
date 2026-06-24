const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });

  const token = authHeader.split(" ")[1]; 
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid atau sudah kadaluarsa." });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Akses Ditolak! Fitur ini tidak tersedia untuk role: ${req.user?.role || 'Guest'}` 
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };