const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { login, getUsers, register, editUser, deleteUser } = require('../controllers/authController');
const { loginRules, registerRules, editUserRules } = require('../validation/authValidation');
const { validateIdParam } = require('../validation/sanitizer');

// Health Check (publik, tanpa auth) - digunakan frontend untuk deteksi server mati
router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Auth Routes
router.post('/login', loginRules, login);
router.get('/users', verifyToken, authorizeRoles('admin'), getUsers);
router.post('/register', verifyToken, authorizeRoles('admin'), registerRules, register);
router.put('/users/:id', verifyToken, authorizeRoles('admin'), ...validateIdParam(), editUserRules, editUser);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteUser);

module.exports = router;