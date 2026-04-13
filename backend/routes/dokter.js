const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. READ: Ambil semua data dokter (dengan JOIN Poli)
router.get('/', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const sql = `
        SELECT dokter.*, poli.nama_poli 
        FROM dokter 
        LEFT JOIN poli ON dokter.poli_id_poli = poli.id_poli
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREATE: Tambah dokter baru
router.post('/', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const { nama_dokter, jadwal_praktik, users_idusers, poli_id_poli } = req.body;
    const sql = "INSERT INTO dokter (nama_dokter, jadwal_praktik, users_idusers, poli_id_poli) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nama_dokter, jadwal_praktik, users_idusers, poli_id_poli], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data dokter berhasil ditambahkan", id: result.insertId });
    });
});

// 3. UPDATE: Ubah data dokter
router.put('/:id', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const { id } = req.params;
    const { nama_dokter, jadwal_praktik, poli_id_poli } = req.body;
    const sql = "UPDATE dokter SET nama_dokter = ?, jadwal_praktik = ?, poli_id_poli = ? WHERE id_dokter = ?";
    
    db.query(sql, [nama_dokter, jadwal_praktik, poli_id_poli, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data dokter berhasil diperbarui" });
    });
});

// 4. DELETE: Hapus dokter
router.delete('/:id', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM dokter WHERE id_dokter = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data dokter berhasil dihapus" });
    });
});

router.get('/poli', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    db.query("SELECT * FROM poli", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/poli', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const { nama_poli } = req.body;
    const sql = "INSERT INTO poli (nama_poli) VALUES (?)";
    
    db.query(sql, [nama_poli], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poli berhasil ditambahkan", id: result.insertId });
    });
});

router.delete('/poli/:id', verifyToken, authorizeRoles('admin', 'resepsionis', 'dokter', 'apoteker'), (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM poli WHERE id_poli = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Poli berhasil dihapus" });
    });
});

module.exports = router;