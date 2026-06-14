const express = require('express');
const router = express.Router();
const { getTransacciones } = require('../controllers/transaccionesController');

router.get('/:cbu', getTransacciones);

module.exports = router;