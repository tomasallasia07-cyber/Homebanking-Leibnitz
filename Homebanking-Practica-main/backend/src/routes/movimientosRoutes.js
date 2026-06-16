const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { getMovimientos } = require('../controllers/movimientosController');

router.get('/', requireAuth(), getMovimientos);

module.exports = router;