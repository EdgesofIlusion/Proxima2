const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Middleware pour vérifier les droits admin
const requireAdmin = (req, res, next) => {
  if (req.user.type !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Accès admin requis' });
  }
  next();
};

// GET /api/admin/lieux-pending - Lieux en attente de modération
router.get('/lieux-pending', auth, requireAdmin, async (req, res) => {
  try {
    const lieux = await prisma.lieu.findMany({
      where: { statut: 'EN_ATTENTE' },
      include: {
        utilisateur: { select: { nom: true, email: true, type: true } },
        _count: { select: { commentaires: true } }
      },
      orderBy: { date_creation: 'desc' }
    });
    res.json({ success: true, data: lieux });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PATCH /api/admin/lieux/:id/moderate - Modérer un lieu
router.patch('/lieux/:id/moderate',
  auth, requireAdmin,
  [body('statut').isIn(['APPROUVE', 'REJETE']).withMessage('Statut invalide')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { statut } = req.body;
      const lieu = await prisma.lieu.update({
        where: { id: req.params.id },
        data: { statut },
        include: { utilisateur: { select: { nom: true, email: true } } }
      });
      res.json({ success: true, message: `Lieu ${statut.toLowerCase()}`, data: lieu });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);

// GET /api/admin/stats - Statistiques générales
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const [totalUsers, totalLieux, lieuxPending, totalCommentaires] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.lieu.count({ where: { statut: 'APPROUVE' } }),
      prisma.lieu.count({ where: { statut: 'EN_ATTENTE' } }),
      prisma.commentaire.count()
    ]);
    res.json({
      success: true,
      data: { totalUsers, totalLieux, lieuxPending, totalCommentaires }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/admin/users - Gestion des utilisateurs
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = type ? { type } : {};
    const [users, total] = await Promise.all([
      prisma.utilisateur.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true, nom: true, email: true, type: true, date_inscription: true,
          _count: { select: { lieux: true, commentaires: true } }
        },
        orderBy: { date_inscription: 'desc' }
      }),
      prisma.utilisateur.count({ where })
    ]);
    res.json({
      success: true,
      data: { users, pagination: { page: parseInt(page), limit: parseInt(limit), total } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;

// Import des notifications
const { notifyModerationResult } = require('../services/notificationService');

// PATCH /api/admin/lieux/:id/moderate - Avec notifications
router.patch('/lieux/:id/moderate-v2',
  auth, requireAdmin,
  [body('statut').isIn(['APPROUVE', 'REJETE'])],
  async (req, res) => {
    try {
      const { statut } = req.body;
      const lieu = await prisma.lieu.update({
        where: { id: req.params.id },
        data: { statut },
        include: { utilisateur: { select: { nom: true, email: true } } }
      });
      // Notification au propriétaire
      await notifyModerationResult(lieu, statut);
      res.json({ success: true, message: `Lieu ${statut.toLowerCase()} avec notification`, data: lieu });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }
);
