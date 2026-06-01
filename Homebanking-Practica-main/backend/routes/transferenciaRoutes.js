const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { realizarTransferencia } = require('../controllers/transferenciaController');

router.post('/', auth, realizarTransferencia);

module.exports = router;