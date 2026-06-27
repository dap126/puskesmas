const db = require('../config/db');

// GET /
exports.getAllMedis = (req, res) => {
  const sql = `
    SELECT rm.*, p.nama_pasien, d.nama_dokter, ro.status_tebus,
           a.status AS status_antrean
    FROM rekam_medis rm
    JOIN pasien p ON rm.pasien_idpasien = p.idpasien
    JOIN dokter d ON rm.dokter_id_dokter = d.id_dokter
    LEFT JOIN resep_obat ro ON ro.rekam_medis_id_rm = rm.id_rm
    LEFT JOIN antrean a ON a.pasien_idpasien = rm.pasien_idpasien
      AND DATE(a.tgl_antrean) = DATE(rm.tgl_periksa)
    ORDER BY rm.tgl_periksa DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST /
exports.createMedis = (req, res) => {
  const {
    tgl_periksa, keluhan, tinggi_badan, berat_badan,
    tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter,
  } = req.body;

  const sql = `
    INSERT INTO rekam_medis 
      (tgl_periksa, keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [tgl_periksa, keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, pasien_idpasien, dokter_id_dokter];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Rekam medis berhasil disimpan', id: result.insertId });
  });
};

// PUT /:id
exports.updateMedis = (req, res) => {
  const { id } = req.params;
  const { keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa } = req.body;
  const sql = `
    UPDATE rekam_medis 
    SET keluhan=?, tinggi_badan=?, berat_badan=?, tekanan_darah=?, diagnosa=? 
    WHERE id_rm=?
  `;
  db.query(sql, [keluhan, tinggi_badan, berat_badan, tekanan_darah, diagnosa, id], (err) => {
    if (err) {
      console.error('Error in updateMedis:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Rekam medis berhasil diperbarui' });
  });
};

// DELETE /:id
exports.deleteMedis = (req, res) => {
  const { id } = req.params;
  
  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: 'Gagal koneksi db' });

    conn.query('SELECT id_resep, status_tebus FROM resep_obat WHERE rekam_medis_id_rm = ?', [id], (err, results) => {
      if (err) { conn.release(); return res.status(500).json({ error: err.message }); }
      
      let status_tebus = null;
      let id_resep = null;
      if (results.length > 0) {
        status_tebus = results[0].status_tebus;
        id_resep = results[0].id_resep;
      }

      if (status_tebus === 'sudah' || status_tebus === 'selesai') {
        conn.release();
        return res.status(400).json({ error: 'Tidak dapat menghapus riwayat medis karena resep sudah selesai.' });
      }

      conn.beginTransaction((err) => {
        if (err) { conn.release(); return res.status(500).json({ error: 'Gagal memulai transaksi' }); }

        const deleteRecords = () => {
          conn.query('DELETE FROM rekam_medis WHERE id_rm = ?', [id], (err) => {
            if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ error: err.message }); });
            conn.commit((err) => {
              if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ error: 'Gagal commit' }); });
              conn.release();
              res.json({ message: 'Rekam medis berhasil dihapus' });
            });
          });
        };

        if (id_resep) {
          conn.query('SELECT obat_id_obat, jumlah_obat FROM detail_resep WHERE resep_obat_id_resep = ?', [id_resep], (err, details) => {
            if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ error: err.message }); });

            let restorePromises = [];
            // Jika status 'belum', stok sudah dipotong saat pembuatan, jadi kembalikan stoknya.
            if (status_tebus === 'belum' && details.length > 0) {
              restorePromises = details.map(item => {
                return new Promise((resolve, reject) => {
                  conn.query('UPDATE obat SET stok = stok + ? WHERE id_obat = ?', [item.jumlah_obat, item.obat_id_obat], (err) => {
                    if (err) reject(err); else resolve();
                  });
                });
              });
            }

            Promise.all(restorePromises).then(() => {
              conn.query('DELETE FROM detail_resep WHERE resep_obat_id_resep = ?', [id_resep], (err) => {
                if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ error: err.message }); });
                
                conn.query('DELETE FROM resep_obat WHERE id_resep = ?', [id_resep], (err) => {
                  if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ error: err.message }); });
                  deleteRecords();
                });
              });
            }).catch(err => {
              conn.rollback(() => { conn.release(); res.status(500).json({ error: 'Gagal mengembalikan stok obat' }); });
            });
          });
        } else {
          deleteRecords();
        }
      });
    });
  });
}