const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const prisma = new PrismaClient();
const router = express.Router();

// ROUTES SPÉCIFIQUES EN PREMIER (avant /:id)

// GET /api/lieux/search - Recherche avancée
router.get('/search', async (req, res) => {
  try {
    const { q, type, ville, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { statut: 'APPROUVE' };
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { ville: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (type) where.type = type;
    if (ville) where.ville = { contains: ville, mode: 'insensitive' };
    const [lieux, total] = await Promise.all([
      prisma.lieu.findMany({
        where, skip, take: parseInt(limit),
        include: { utilisateur: { select: { nom: true, type: true } } },
        orderBy: { date_creation: 'desc' }
      }),
      prisma.lieu.count({ where })
    ]);
    res.json({ success: true, data: { lieux, total, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
  } catch (error) {
    console.error('Erreur search:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/lieux/nearby/:lat/:lon - Recherche proximité
router.get('/nearby/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 50 } = req.query;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);
    const latDelta = rad / 111;
    const lonDelta = rad / (111 * Math.cos(lat * Math.PI / 180));
    const lieux = await prisma.lieu.findMany({
      where: {
        statut: 'APPROUVE',
        latitude: { gte: lat - latDelta, lte: lat + latDelta },
        longitude: { gte: lon - lonDelta, lte: lon + lonDelta }
      },
      include: { utilisateur: { select: { nom: true, type: true } } }
    });
    res.json({ success: true, data: lieux });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/lieux - Liste générale (existant)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, ville } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { statut: 'APPROUVE' };
    if (type) where.type = type;
    if (ville) where.ville = { contains: ville, mode: 'insensitive' };
    const [lieux, total] = await Promise.all([
      prisma.lieu.findMany({ where, skip, take: parseInt(limit), include: { utilisateur: { select: { nom: true, type: true } } }, orderBy: { date_creation: 'desc' } }),
      prisma.lieu.count({ where })
    ]);
    res.json({ success: true, data: { lieux, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/lieux/:id - APRÈS les routes spécifiques
router.get('/:id', async (req, res) => {
  try {
    const lieu = await prisma.lieu.findUnique({
      where: { id: req.params.id },
      include: { utilisateur: { select: { nom: true, type: true } }, commentaires: { include: { auteur: { select: { nom: true } } }, orderBy: { date: 'desc' } } }
    });
    if (!lieu) return res.status(404).json({ success: false, message: 'Lieu non trouvé' });
    res.json({ success: true, data: lieu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
