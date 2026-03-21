const jwt = require('jsonwebtoken');
require('dotenv').config();

// Satpam 1: Cek Token (Tetap sama seperti sebelumnya)
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

// Satpam 2: Cek Multi-Role (BARU)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Mengecek apakah role user yang login ada di dalam daftar role yang diizinkan
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Akses Ditolak! Fitur ini tidak tersedia untuk role: ${req.user?.role || 'Guest'}` 
      });
    }
    next(); // Lolos, silakan masuk
  };
};

module.exports = { verifyToken, authorizeRoles };