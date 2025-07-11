const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('nom').notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('mot_de_passe').isLength({ min: 6 }).withMessage('Mot de passe min 6 caractäres')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('mot_de_passe').notEmpty().withMessage('Mot de passe requis')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;
