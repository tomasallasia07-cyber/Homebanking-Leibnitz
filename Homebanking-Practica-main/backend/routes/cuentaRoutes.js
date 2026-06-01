const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { obtenerSaldo, obtenerMovimientos } = require('../controllers/cuentaController');

router.get('/saldo', auth, obtenerSaldo);
router.get('/movimientos', auth, obtenerMovimientos);

module.exports = router;