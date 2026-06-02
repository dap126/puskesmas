const db = require('../config/db');

module.exports = {
    // Ringkasan: total pasien, total kunjungan (antrean selesai), total resep
    getRingkasan: async (req, res) => {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM pasien) AS total_pasien,
                    (SELECT COUNT(*) FROM antrean WHERE status = 'Selesai') AS total_kunjungan,
                    (SELECT COUNT(*) FROM resep_obat) AS total_resep
            `;
            const [rows] = await db.promise().query(query);
            res.json({ success: true, data: rows[0] });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Kunjungan: data antrean join pasien dan poli, LEFT JOIN rekam_medis untuk data dokter & diagnosa
    getKunjungan: async (req, res) => {
        try {
            const query = `
                SELECT 
                    a.tgl_antrean,
                    a.no_antrean,
                    a.status,
                    p.nama_pasien,
                    p.nik,
                    po.nama_poli,
                    d.nama_dokter,
                    rm.diagnosa
                FROM antrean a
                JOIN pasien p ON a.pasien_idpasien = p.idpasien
                JOIN poli po ON a.poli_id_poli = po.id_poli
                LEFT JOIN rekam_medis rm ON rm.pasien_idpasien = a.pasien_idpasien
                    AND rm.id_rm = (
                        SELECT MAX(r2.id_rm) FROM rekam_medis r2
                        WHERE r2.pasien_idpasien = a.pasien_idpasien
                        AND DATE(r2.tgl_periksa) <= DATE(a.tgl_antrean)
                    )
                LEFT JOIN dokter d ON rm.dokter_id_dokter = d.id_dokter
                WHERE a.status IN ('Selesai', 'Batal')
                ORDER BY a.tgl_antrean DESC
            `;
            const [rows] = await db.promise().query(query);
            res.json({ success: true, data: rows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Penyakit: diambil dari kolom diagnosa di rekam_medis (tidak ada tabel penyakit)
    getPenyakit: async (req, res) => {
        try {
            const query = `
                SELECT 
                    diagnosa AS nama_penyakit,
                    COUNT(*) AS jumlah
                FROM rekam_medis
                WHERE diagnosa IS NOT NULL AND diagnosa != ''
                GROUP BY diagnosa
                ORDER BY jumlah DESC
                LIMIT 10
            `;
            const [rows] = await db.promise().query(query);
            res.json({ success: true, data: rows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Obat: stok dari tabel obat, hitung yang sudah terpakai dari detail_resep
    getObat: async (req, res) => {
        try {
            const query = `
                SELECT 
                    o.nama_obat,
                    o.stok,
                    o.satuan,
                    o.kategori,
                    (SELECT IFNULL(SUM(dr.jumlah_obat), 0) FROM detail_resep dr WHERE dr.obat_id_obat = o.id_obat) AS stok_terpakai
                FROM obat o
                ORDER BY o.stok ASC
            `;
            const [rows] = await db.promise().query(query);
            res.json({ success: true, data: rows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
