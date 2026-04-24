const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Obat
// GET semua obat
router.get('/obat', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
  const sql = "SELECT * FROM obat ORDER BY id_obat DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data obat" });
    res.json(results);
  });
});

// POST tambah obat
router.post('/obat', verifyToken, authorizeRoles('admin', 'apoteker'), (req, res) => {
  const { nama_obat, kategori, stok, satuan } = req.body;

  const sql = "INSERT INTO obat (nama_obat, kategori, stok, satuan) VALUES (?, ?, ?, ?)";

  db.query(sql, [nama_obat, kategori, stok, satuan], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal tambah obat" });

    res.status(201).json({
      message: "Obat berhasil ditambahkan",
      id_obat: result.insertId
    });
  });
});

// PUT update obat
router.put('/obat/:id', verifyToken, authorizeRoles('admin', 'apoteker'), (req, res) => {
  const { id } = req.params;
  const { nama_obat, kategori, stok, satuan } = req.body;

  const sql = `
    UPDATE obat 
    SET nama_obat=?, kategori=?, stok=?, satuan=?
    WHERE id_obat=?
  `;

  db.query(sql, [nama_obat, kategori, stok, satuan, id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal update obat" });
    res.json({ message: "Obat berhasil diupdate" });
  });
});

// DELETE obat
router.delete('/obat/:id', verifyToken, authorizeRoles('admin', 'apoteker'), (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM obat WHERE id_obat=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal hapus obat" });
    res.json({ message: "Obat berhasil dihapus" });
  });
});


module.exports = router;