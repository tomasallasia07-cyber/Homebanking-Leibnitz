const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { getMe } = require('../controllers/authController');

router.get('/me', requireAuth(), getMe);

module.exports = router;