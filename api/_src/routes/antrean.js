const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllAntrean, getSeluruhAntrean, createAntrean, updateStatusAntrean, resetAntrean, resetSemuaAntrean } = require('../controllers/antreanController');
const { antreanRules, updateStatusAntreanRules } = require('../validation/antreanValidation');
const { validateIdParam } = require('../validation/sanitizer');

const roles = ['admin', 'staff', 'dokter'];

// Antrean Routes
router.get('/', verifyToken, authorizeRoles(...roles), getAllAntrean);
router.get('/all', verifyToken, authorizeRoles('admin'), getSeluruhAntrean);
router.post('/', verifyToken, authorizeRoles(...roles), antreanRules, createAntrean);
router.patch('/:id/status', verifyToken, authorizeRoles(...roles), ...validateIdParam(), updateStatusAntreanRules, updateStatusAntrean);
router.delete('/reset', verifyToken, authorizeRoles('admin', 'staff'), resetAntrean);
router.delete('/reset-all', verifyToken, authorizeRoles('admin'), resetSemuaAntrean);

module.exports = router;