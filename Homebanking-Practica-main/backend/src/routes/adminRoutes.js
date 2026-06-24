const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const {
    getUsuarios, agregarSaldo, editarPersona,
    editarAlias, editarEstadoProducto, cambiarNombreBanco, getBancos
} = require('../controllers/adminController');

router.get('/usuarios', requireAuth(), getUsuarios);
router.put('/usuarios/:id/saldo', requireAuth(), agregarSaldo);
router.put('/usuarios/:id/persona', requireAuth(), editarPersona);
router.put('/usuarios/:id/alias', requireAuth(), editarAlias);
router.put('/usuarios/:id/producto', requireAuth(), editarEstadoProducto);
router.put('/banco/nombre', requireAuth(), cambiarNombreBanco);
router.get('/bancos', requireAuth(), getBancos);

module.exports = router;