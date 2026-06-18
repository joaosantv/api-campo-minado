const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// mapeia o cadastro
router.post('/register', authController.register);

// mapeia o login
router.post('/login', authController.login);

// mapeia o reset de senha
router.patch('/reset-password', authController.resetPassword);

module.exports = router;