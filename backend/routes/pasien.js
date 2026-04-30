const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/pasien', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    db.query("SELECT * FROM pasien", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/pasien', verifyToken, authorizeRoles('admin', 'staff'), (req, res) => {
    const { nama_pasien, nik, tgl_lahir, jenis_kelamin, alamat, no_telpon } = req.body;
    const sql = "INSERT INTO pasien (nama_pasien, nik, tgl_lahir, jenis_kelamin, alamat, no_telpon) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [nama_pasien, nik, tgl_lahir, jenis_kelamin, alamat || '-', no_telpon], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Pasien berhasil ditambahkan", id_pasien: result.insertId });
    });
});

router.put('/pasien/:id', verifyToken, authorizeRoles('admin', 'staff'), (req, res) => {
    const { id } = req.params;
    const { nama_pasien, nik, tgl_lahir, jenis_kelamin, alamat, no_telpon } = req.body;
    const sql = "UPDATE pasien SET nama_pasien=?, nik=?, tgl_lahir=?, jenis_kelamin=?, alamat=?, no_telpon=? WHERE idpasien=?";
    
    db.query(sql, [nama_pasien, nik, tgl_lahir, jenis_kelamin, alamat || '-', no_telpon, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Pasien berhasil diupdate" });
    });
});

router.delete('/pasien/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM pasien WHERE idpasien=?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Pasien berhasil dihapus" });
    });
});

module.exports = router;