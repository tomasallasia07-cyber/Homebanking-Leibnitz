const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { getPersonas, getPersonasByID, postPersonas, updatePersonas, deletePersonas } = require('../controllers/personasController');

router.get('/', requireAuth(), getPersonas);
router.get('/:id', requireAuth(), getPersonasByID);
router.post('/', requireAuth(), postPersonas);
router.put('/:id', requireAuth(), updatePersonas);
router.delete('/:id', requireAuth(), deletePersonas);

module.exports = router;