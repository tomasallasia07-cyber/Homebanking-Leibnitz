const express = require('express');
const router = express.Router();
const { registro, login, loginORegistrarClerk } = require('../controllers/authController');

router.post('/registro', registro);
router.post('/login', login);
router.post('/clerk', loginORegistrarClerk);

module.exports = router;