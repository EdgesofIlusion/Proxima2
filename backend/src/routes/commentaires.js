const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/commentaires/lieu/:lieuId - Commentaires d'un lieu
router.get('/lieu/:lieuId', async (req, res) => {
  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { lieu_id: req.params.lieuId },
      include: { auteur: { select: { nom: true, type: true } } },
      orderBy: { date: 'desc' }
    });
    res.json({ success: true, data: commentaires });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/commentaires - Créer un commentaire
router.post('/',
  auth,
  [
    body('lieu_id').notEmpty().withMessage('ID lieu requis'),
    body('texte').notEmpty().withMessage('Texte requis').isLength({ min: 5, max: 1000 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { lieu_id, texte, video_lien } = req.body;
      const commentaire = await prisma.commentaire.create({
        data: { lieu_id, texte, video_lien, auteur_id: req.user.id },
        include: { auteur: { select: { nom: true, type: true } } }
      });
      res.status(201).json({ success: true, message: 'Commentaire créé', data: commentaire });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

module.exports = router;
