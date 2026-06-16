const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { postTransferencia, sincronizarEntrantes } = require('../controllers/transferenciasController');

router.post('/', requireAuth(), postTransferencia);

// Botón manual de "actualizar" desde el frontend
router.post('/sincronizar', requireAuth(), async (req, res) => {
    await sincronizarEntrantes();
    res.status(200).json({ mensaje: 'Sincronización completada' });
});

module.exports = router;