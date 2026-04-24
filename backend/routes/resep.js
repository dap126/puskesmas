const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// GET detail resep + JOIN obat
router.get('/detail-resep', verifyToken, authorizeRoles('admin', 'dokter', 'apoteker'), (req, res) => {
  const sql = `
    SELECT dr.id_detail, dr.jumlah_obat, dr.dosis,
           o.nama_obat, o.satuan,
           dr.resep_obat_id_resep
    FROM detail_resep dr
    JOIN obat o ON dr.obat_id_obat = o.id_obat
    ORDER BY dr.id_detail DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil detail resep" });
    res.json(results);
  });
});


// POST tambah detail resep + AUTO KURANGI STOK 🔥
router.post('/detail-resep', verifyToken, authorizeRoles('admin', 'dokter'), (req, res) => {
  const { jumlah_obat, dosis, resep_id, obat_id } = req.body;

  // 1. CEK STOK
  const cekStok = "SELECT stok FROM obat WHERE id_obat = ?";
  
  db.query(cekStok, [obat_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error cek stok" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Obat tidak ditemukan" });
    }

    const stok = result[0].stok;

    if (stok < jumlah_obat) {
      return res.status(400).json({ message: "Stok tidak mencukupi!" });
    }

    // 2. INSERT DETAIL RESEP
    const insert = `
      INSERT INTO detail_resep (jumlah_obat, dosis, resep_obat_id_resep, obat_id_obat)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insert, [jumlah_obat, dosis, resep_id, obat_id], (err) => {
      if (err) return res.status(500).json({ error: "Gagal tambah detail resep" });

      // 3. KURANGI STOK
      const updateStok = `
        UPDATE obat 
        SET stok = stok - ?
        WHERE id_obat = ?
      `;

      db.query(updateStok, [jumlah_obat, obat_id]);

      res.status(201).json({
        message: "Detail resep berhasil ditambahkan & stok dikurangi"
      });
    });
  });
});


// DELETE detail resep + BALIKIN STOK 🔥
router.delete('/detail-resep/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;

  // ambil data dulu
  const getData = "SELECT jumlah_obat, obat_id_obat FROM detail_resep WHERE id_detail=?";

  db.query(getData, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error ambil data" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const { jumlah_obat, obat_id_obat } = result[0];

    // hapus
    db.query("DELETE FROM detail_resep WHERE id_detail=?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Gagal hapus detail resep" });

      // balikin stok
      const updateStok = `
        UPDATE obat 
        SET stok = stok + ?
        WHERE id_obat = ?
      `;

      db.query(updateStok, [jumlah_obat, obat_id_obat]);

      res.json({ message: "Detail resep dihapus & stok dikembalikan" });
    });
  });
});

module.exports = router;
