const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const router = express.Router();

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register',
  [
    body('nom').notEmpty(),
    body('email').isEmail(),
    body('mot_de_passe').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { nom, email, mot_de_passe, type = 'USER' } = req.body;
      const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ success: false, message: 'Email d‚j… utilis‚' });
      const hashedPassword = await bcrypt.hash(mot_de_passe, 12);
      const user = await prisma.utilisateur.create({
        data: { nom, email, mot_de_passe: hashedPassword, type },
        select: { id: true, nom: true, email: true, type: true }
      });
      const token = generateToken(user.id);
      res.status(201).json({ success: true, data: { user, token } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
    const token = generateToken(user.id);
    const userData = { id: user.id, nom: user.nom, email: user.email, type: user.type };
    res.json({ success: true, data: { user: userData, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
