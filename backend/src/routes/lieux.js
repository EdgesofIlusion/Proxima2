// src/routes/lieux.js - Routes des lieux
const express = require('express');
const router = express.Router();

// Route temporaire pour test
router.get('/', (req, res) => {
  res.json({ message: 'Routes lieux OK' });
});

module.exports = router;