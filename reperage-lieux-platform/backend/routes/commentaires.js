const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour les commentaires
const commentaireValidation = [
  body('texte').trim().isLength({ min: 1, max: 1000 }).withMessage('Le commentaire doit contenir entre 1 et 1000 caractères'),
  body('video_lien').optional().isURL().withMessage('URL vidéo invalide'),
  body('lieu_id').isString().notEmpty().withMessage('ID du lieu requis')
];

// GET /api/commentaires/lieu/:lieuId - Récupérer les commentaires d'un lieu
router.get('/lieu/:lieuId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const commentaires = await prisma.commentaire.findMany({
      where: { lieu_id: req.params.lieuId },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        auteur: {
          select: { nom: true, type: true }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const total = await prisma.commentaire.count({
      where: { lieu_id: req.params.lieuId }
    });

    res.json({
      commentaires,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
  }
});

// POST /api/commentaires - Créer un nouveau commentaire
router.post('/', authenticateToken, commentaireValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { texte, video_lien, lieu_id } = req.body;

    // Vérifier que le lieu existe
    const lieu = await prisma.lieu.findUnique({
      where: { id: lieu_id }
    });

    if (!lieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Créer le commentaire
    const commentaire = await prisma.commentaire.create({
      data: {
        texte,
        video_lien,
        lieu_id,
        auteur_id: req.user.id
      },
      include: {
        auteur: {
          select: { nom: true, type: true }
        }
      }
    });

    res.status(201).json({
      message: 'Commentaire ajouté avec succès',
      commentaire
    });

  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
  }
});

// DELETE /api/commentaires/:id - Supprimer un commentaire
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const commentaireId = req.params.id;

    // Vérifier que le commentaire existe
    const existingCommentaire = await prisma.commentaire.findUnique({
      where: { id: commentaireId }
    });

    if (!existingCommentaire) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier les permissions (auteur ou admin)
    if (existingCommentaire.auteur_id !== req.user.id && req.user.type !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Supprimer le commentaire
    await prisma.commentaire.delete({
      where: { id: commentaireId }
    });

    res.json({ message: 'Commentaire supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
  }
});

module.exports = router;