const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// API Dashboard yang sudah digembok (hanya yang bawa Token valid yang bisa akses)
router.get('/statistik', verifyToken, async (req, res) => {
  try {
    const [genderStats] = await db.promise().query(`
      SELECT jenis_kelamin, COUNT(*) as count 
      FROM pasien 
      GROUP BY jenis_kelamin
    `);
    
    const [ageStats] = await db.promise().query(`
      SELECT 
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) <= 2 THEN 1 ELSE 0 END) AS bayi,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) > 2 AND TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) <= 5 THEN 1 ELSE 0 END) AS balita,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) > 5 AND TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) <= 12 THEN 1 ELSE 0 END) AS anak_anak,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) > 12 AND TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) <= 17 THEN 1 ELSE 0 END) AS remaja,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) > 17 AND TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) <= 59 THEN 1 ELSE 0 END) AS dewasa,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tgl_lahir, CURDATE()) >= 60 THEN 1 ELSE 0 END) AS lansia
      FROM pasien
    `);

    res.json({
      message: "Berhasil mengambil statistik Dashboard",
      // Data dummy sementara
      total_pasien: 8282,
      total_antrean: 215542,
      gender_stats: genderStats,
      age_stats: ageStats[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil statistik dashboard" });
  }
});

module.exports = router;