const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// GET detail resep + JOIN obat
router.get('/detail-resep', verifyToken, authorizeRoles('admin', 'dokter', 'staff'), (req, res) => {
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


// POST tambah detail resep + AUTO BUAT RESEP + AUTO KURANGI STOK
router.post('/detail-resep', verifyToken, authorizeRoles('admin', 'dokter', 'staff'), (req, res) => {
  const { jumlah_obat, dosis, obat_id } = req.body;

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

    // 2. AUTO BUAT RESEP OBAT (id_resep auto increment)
    // Ambil rekam_medis terakhir sebagai referensi
    db.query("SELECT id_rm FROM rekam_medis ORDER BY id_rm DESC LIMIT 1", (err, rmResult) => {
      if (err || rmResult.length === 0) {
        return res.status(400).json({ message: "Belum ada data rekam medis. Tambahkan rekam medis terlebih dahulu." });
      }

      const rmId = rmResult[0].id_rm;

      const insertResep = "INSERT INTO resep_obat (tgl_resep, status_tebus, rekam_medis_id_rm) VALUES (NOW(), 'belum', ?)";

      db.query(insertResep, [rmId], (err, resepResult) => {
        if (err) return res.status(500).json({ error: "Gagal membuat resep otomatis", detail: err.message });

      const resepId = resepResult.insertId;

      // 3. INSERT DETAIL RESEP
      const insert = `
        INSERT INTO detail_resep (jumlah_obat, dosis, resep_obat_id_resep, obat_id_obat)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insert, [jumlah_obat, dosis, resepId, obat_id], (err) => {
        if (err) return res.status(500).json({ error: "Gagal tambah detail resep" });

        // 4. KURANGI STOK
        const updateStok = `
          UPDATE obat 
          SET stok = stok - ?
          WHERE id_obat = ?
        `;

        db.query(updateStok, [jumlah_obat, obat_id]);

        res.status(201).json({
          message: "Detail resep berhasil ditambahkan & stok dikurangi",
          resep_id: resepId
        });
        });
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

// POST: Simpan Pemeriksaan dan Resep Obat (Transaksi)
router.post('/resep', verifyToken, authorizeRoles('admin', 'dokter', 'staff'), (req, res) => {
  const { rekam_medis_id_rm, daftar_obat } = req.body;

  // Validasi payload
  if (!rekam_medis_id_rm || !daftar_obat || !Array.isArray(daftar_obat) || daftar_obat.length === 0) {
    return res.status(400).json({ message: "Data rekam medis atau daftar obat tidak lengkap" });
  }

  // 1. Mulai Transaksi
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Gagal memulai transaksi", detail: err.message });

    // 2. INSERT ke tabel resep_obat
    const insertResep = "INSERT INTO resep_obat (tgl_resep, status_tebus, rekam_medis_id_rm) VALUES (NOW(), 'belum', ?)";
    
    db.query(insertResep, [rekam_medis_id_rm], (err, resepResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Gagal membuat resep_obat", detail: err.message });
        });
      }

      const resepId = resepResult.insertId;
      let completed = 0;
      let hasError = false;

      // 3. Looping pada array daftar_obat
      for (let i = 0; i < daftar_obat.length; i++) {
        const obat = daftar_obat[i];
        
        // 4. INSERT ke tabel detail_resep
        const insertDetail = `
          INSERT INTO detail_resep (jumlah_obat, dosis, resep_obat_id_resep, obat_id_obat) 
          VALUES (?, ?, ?, ?)
        `;
        
        db.query(insertDetail, [obat.jumlah_obat, obat.dosis, resepId, obat.obat_id_obat], (err) => {
          // Cegah pengiriman respons ganda jika sudah ada error
          if (hasError) return; 

          if (err) {
            hasError = true;
            // 5. Jika error, rollback
            return db.rollback(() => {
              res.status(500).json({ error: "Gagal menyimpan detail_resep", detail: err.message });
            });
          }

          completed++;
          
          // 6. Jika semua loop INSERT detail berhasil, commit dan kirim response 201
          if (completed === daftar_obat.length) {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Gagal commit transaksi", detail: err.message });
                });
              }
              res.status(201).json({ 
                message: "Pemeriksaan dan Resep Obat berhasil disimpan secara transaksional", 
                resep_id: resepId 
              });
            });
          }
        });
      }
    });
  });
});

module.exports = router;