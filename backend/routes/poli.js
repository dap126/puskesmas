const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/poli', verifyToken, authorizeRoles('admin', 'staff', 'dokter'), (req, res) => {
    db.query("SELECT * FROM poli", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/poli', verifyToken, authorizeRoles('admin'), (req, res) => {
    const { nama_poli } = req.body;
    const sql = "INSERT INTO poli (nama_poli) VALUES (?)";
    
    db.query(sql, [nama_poli], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poli berhasil ditambahkan", id: result.insertId });
    });
});

router.delete('/poli/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM poli WHERE id_poli = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poli berhasil dihapus" });
    });
});

module.exports = router;
