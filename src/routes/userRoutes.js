const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// dashboard tem que vir primeiro senao o express acha que 'dashboard' é um id
router.get('/dashboard', userController.getDashboard); 
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateSaldo);
router.delete('/:id', userController.deleteUser);

module.exports = router;