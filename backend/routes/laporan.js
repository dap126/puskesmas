const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/ringkasan', verifyToken, laporanController.getRingkasan);
router.get('/kunjungan', verifyToken, laporanController.getKunjungan);
router.get('/penyakit', verifyToken, laporanController.getPenyakit);
router.get('/obat', verifyToken, laporanController.getObat);

module.exports = router;
