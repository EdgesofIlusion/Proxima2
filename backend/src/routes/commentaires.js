// src/routes/commentaires.js - Routes des commentaires
const express = require('express');
const router = express.Router();

// Route temporaire pour test
router.get('/', (req, res) => {
  res.json({ message: 'Routes commentaires OK' });
});

module.exports = router;