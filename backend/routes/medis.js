const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET: Semua Rekam Medis
router.get('/', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    const sql = `
        SELECT rm.*, p.nama_pasien, d.nama_dokter 
        FROM rekam_medis rm
        JOIN pasien p ON rm.pasien_idpasien = p.idpasien
        JOIN dokter d ON rm.dokter_id_dokter = d.id_dokter
        ORDER BY rm.tgl_periksa DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. POST: Tambah Rekam Medis
router.post('/', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    const { 
        tgl_periksa, keluhan, tinggi_badan, berat_badan, 
        tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter 
    } = req.body;

    const sql = `INSERT INTO rekam_medis 
        (tgl_periksa, keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [tgl_periksa, keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: "Rekam medis berhasil disimpan", 
            id: result.insertId 
        });
    });
});

// 3. PUT: Update Rekam Medis
router.put('/:id', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    const { id } = req.params;
    const { keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa } = req.body;

    const sql = `UPDATE rekam_medis 
                 SET keluhan=?, tinggi_badan=?, berat_badan=?, tekanan_darah=?, diagnosa=? 
                 WHERE id_rm=?`;

    db.query(sql, [keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Rekam medis berhasil diperbarui" });
    });
});

// 4. DELETE: Hapus Rekam Medis
router.delete('/:id', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    db.query("DELETE FROM rekam_medis WHERE id_rm = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Rekam medis berhasil dihapus" });
    });
});

module.exports = router;