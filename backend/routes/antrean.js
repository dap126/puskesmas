const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// GET: Lihat Semua Antrean (Biasanya untuk Admin/Poli)
router.get('/', verifyToken, (req, res) => {
    const sql = `
        SELECT a.*, p.nama_pasien, po.nama_poli 
        FROM antrean a
        JOIN pasien p ON a.pasien_idpasien = p.idpasien
        JOIN poli po ON a.poli_id_poli = po.id_poli
        ORDER BY a.tgl_antrean DESC, a.no_antrean ASC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST: Buat Antrean Baru
router.post('/', verifyToken, (req, res) => {
    const { tgl_antrean, no_antrean, status, pasien_idpasien, poli_id_poli } = req.body;
    const sql = "INSERT INTO antrean (tgl_antrean, no_antrean, status, pasien_idpasien, poli_id_poli) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [tgl_antrean, no_antrean, status, pasien_idpasien, poli_id_poli], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Berhasil mengambil antrean", id: result.insertId });
    });
});

// PATCH: Update Status Antrean (Misal: Dipanggil/Selesai)
router.patch('/:id/status', verifyToken, (req, res) => {
    const { status } = req.body;
    db.query("UPDATE antrean SET status = ? WHERE idantrean = ?", [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status antrean diperbarui" });
    });
});

module.exports = router;