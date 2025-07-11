const express = require('express');
const { body } = require('express-validator');
const { getAllLieux, getLieuById } = require('../controllers/lieuController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getAllLieux);
router.get('/:id', getLieuById);

module.exports = router;
