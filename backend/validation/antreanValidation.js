const { body } = require('express-validator');
const { validate } = require('./sanitizer');

// Create Antrean
const antreanRules = [
  body('tgl_antrean')
    .notEmpty().withMessage('Tanggal antrean wajib diisi')
    .isISO8601().withMessage('Format tanggal antrean tidak valid (gunakan YYYY-MM-DD)')
    .toDate(),

  body('no_antrean')
    .trim()
    .notEmpty().withMessage('Nomor antrean wajib diisi')
    .isLength({ min: 1, max: 20 }).withMessage('Nomor antrean maksimal 20 karakter'),

  body('status')
    .trim()
    .notEmpty().withMessage('Status wajib diisi')
    .isIn(['Menunggu', 'Dipanggil', 'Selesai', 'Batal', 'menunggu', 'dipanggil', 'selesai', 'batal']).withMessage('Status tidak valid'),

  body('pasien_idpasien')
    .notEmpty().withMessage('ID pasien wajib diisi')
    .isInt({ min: 1 }).withMessage('ID pasien harus berupa angka positif')
    .toInt(),

  body('poli_id_poli')
    .notEmpty().withMessage('ID poli wajib diisi')
    .isInt({ min: 1 }).withMessage('ID poli harus berupa angka positif')
    .toInt(),

  validate,
];

// Update Status Antrean
const updateStatusAntreanRules = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status wajib diisi')
    .isIn(['Menunggu', 'Dipanggil', 'Selesai', 'Batal', 'menunggu', 'dipanggil', 'selesai', 'batal']).withMessage('Status tidak valid'),

  validate,
];

module.exports = { antreanRules, updateStatusAntreanRules };
