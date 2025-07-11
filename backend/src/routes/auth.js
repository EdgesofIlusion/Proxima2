// src/routes/auth.js - Routes d'authentification
const express = require('express');
const router = express.Router();

// Route temporaire pour test
router.get('/', (req, res) => {
  res.json({ message: 'Routes auth OK' });
});

module.exports = router;