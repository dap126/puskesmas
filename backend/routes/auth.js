const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(401).json({ message: 'Username not found' });
        }
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ id: user.idusers, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({
                message: "Login berhasil!",
                token: token,
                user: {
                    id: user.idusers,
                    username: user.username,
                    role: user.role
                }
            });
        });
    });
});

// Pastikan authorizeRoles sudah di-import di bagian atas file bersama verifyToken
// (Sudah di-import di atas)

// API Ambil Daftar User (HANYA ADMIN)
router.get('/users', verifyToken, authorizeRoles('admin'), (req, res) => {
  // Hanya ambil id, username, nama, dan role, tanpa role 'admin'. Urutkan dari yang terbaru.
  const sql = "SELECT idusers, username, nama, role FROM users WHERE role != 'admin' ORDER BY idusers DESC";
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal mengambil data user" });
    res.json(results);
  });
});

// API Register User Baru (HANYA ADMIN)
router.post('/register', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { username, nama, password, role } = req.body || {};
  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, Password, dan Role harus diisi" });
  }

  const finalNama = nama ? nama : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, nama, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, finalNama, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Username sudah digunakan" });
        }
        return res.status(500).json({ error: "Gagal menyimpan user" });
      }
      res.status(201).json({ message: "User berhasil didaftarkan" });
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// API Edit User (HANYA ADMIN)
router.put('/users/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const userId = req.params.id;
  const { username, nama, role, password } = req.body || {};
  if (!username || !role) {
    return res.status(400).json({ error: "Username dan Role harus diisi" });
  }

  const finalNama = nama ? nama : null;

  try {
    let sql;
    let params;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = "UPDATE users SET username = ?, nama = ?, role = ?, password = ? WHERE idusers = ?";
      params = [username, finalNama, role, hashedPassword, userId];
    } else {
      sql = "UPDATE users SET username = ?, nama = ?, role = ? WHERE idusers = ?";
      params = [username, finalNama, role, userId];
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Username sudah digunakan" });
        }
        return res.status(500).json({ error: "Gagal memperbarui user" });
      }
      res.status(200).json({ message: "User berhasil diperbarui" });
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// API Hapus User (HANYA ADMIN)
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  const userId = req.params.id;
  
  const sql = "DELETE FROM users WHERE idusers = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus user" });
    res.status(200).json({ message: "User berhasil dihapus" });
  });
});

module.exports = router;