const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/lieux/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lieu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// Validation pour la création/modification d'un lieu
const lieuValidation = [
  body('titre').trim().isLength({ min: 3, max: 100 }).withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('La description doit contenir entre 10 et 2000 caractères'),
  body('type').isIn(['PUBLIC', 'PRIVE', 'NATUREL']).withMessage('Type de lieu invalide'),
  body('adresse').trim().isLength({ min: 5, max: 200 }).withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('ville').trim().isLength({ min: 2, max: 100 }).withMessage('La ville doit contenir entre 2 et 100 caractères'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide'),
  body('accessibilite').optional().trim().isLength({ max: 500 }).withMessage('Accessibilité max 500 caractères'),
  body('bruit').optional().trim().isLength({ max: 500 }).withMessage('Bruit max 500 caractères'),
  body('lumiere').optional().trim().isLength({ max: 500 }).withMessage('Lumière max 500 caractères')
];

// GET /api/lieux - Récupérer tous les lieux
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, ville, statut } = req.query;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where = {};
    if (type) where.type = type;
    if (ville) where.ville = { contains: ville, mode: 'insensitive' };
    if (statut) where.statut = statut;

    // Récupérer les lieux
    const lieux = await prisma.lieu.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        utilisateur: {
          select: { nom: true, type: true }
        },
        _count: {
          select: { commentaires: true }
        }
      },
      orderBy: {
        date_creation: 'desc'
      }
    });

    // Compter le total pour la pagination
    const total = await prisma.lieu.count({ where });

    res.json({
      lieux,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lieux' });
  }
});

// GET /api/lieux/:id - Récupérer un lieu spécifique
router.get('/:id', async (req, res) => {
  try {
    const lieu = await prisma.lieu.findUnique({
      where: { id: req.params.id },
      include: {
        utilisateur: {
          select: { nom: true, type: true }
        },
        commentaires: {
          include: {
            auteur: {
              select: { nom: true }
            }
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!lieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    res.json(lieu);

  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du lieu' });
  }
});

// POST /api/lieux - Créer un nouveau lieu
router.post('/', authenticateToken, upload.array('images', 5), lieuValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      titre,
      description,
      type,
      adresse,
      ville,
      latitude,
      longitude,
      accessibilite,
      bruit,
      lumiere
    } = req.body;

    // Gérer les images uploadées
    const images = req.files ? req.files.map(file => `/uploads/lieux/${file.filename}`) : [];

    // Créer le lieu
    const lieu = await prisma.lieu.create({
      data: {
        titre,
        description,
        type,
        adresse,
        ville,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accessibilite,
        bruit,
        lumiere,
        images,
        utilisateur_id: req.user.id
      },
      include: {
        utilisateur: {
          select: { nom: true, type: true }
        }
      }
    });

    res.status(201).json({
      message: 'Lieu créé avec succès',
      lieu
    });

  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    res.status(500).json({ error: 'Erreur lors de la création du lieu' });
  }
});

// PUT /api/lieux/:id - Modifier un lieu
router.put('/:id', authenticateToken, upload.array('images', 5), lieuValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lieuId = req.params.id;

    // Vérifier que le lieu existe
    const existingLieu = await prisma.lieu.findUnique({
      where: { id: lieuId }
    });

    if (!existingLieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Vérifier les permissions (propriétaire ou admin)
    if (existingLieu.utilisateur_id !== req.user.id && req.user.type !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const {
      titre,
      description,
      type,
      adresse,
      ville,
      latitude,
      longitude,
      accessibilite,
      bruit,
      lumiere
    } = req.body;

    // Gérer les nouvelles images
    const nouvelles_images = req.files ? req.files.map(file => `/uploads/lieux/${file.filename}`) : [];
    
    // Combiner avec les anciennes images (si on veut les conserver)
    const images = [...existingLieu.images, ...nouvelles_images];

    // Mettre à jour le lieu
    const lieu = await prisma.lieu.update({
      where: { id: lieuId },
      data: {
        titre,
        description,
        type,
        adresse,
        ville,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accessibilite,
        bruit,
        lumiere,
        images
      },
      include: {
        utilisateur: {
          select: { nom: true, type: true }
        }
      }
    });

    res.json({
      message: 'Lieu modifié avec succès',
      lieu
    });

  } catch (error) {
    console.error('Erreur lors de la modification du lieu:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du lieu' });
  }
});

// DELETE /api/lieux/:id - Supprimer un lieu
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const lieuId = req.params.id;

    // Vérifier que le lieu existe
    const existingLieu = await prisma.lieu.findUnique({
      where: { id: lieuId }
    });

    if (!existingLieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Vérifier les permissions (propriétaire ou admin)
    if (existingLieu.utilisateur_id !== req.user.id && req.user.type !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Supprimer le lieu (cascade sur les commentaires)
    await prisma.lieu.delete({
      where: { id: lieuId }
    });

    res.json({ message: 'Lieu supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du lieu' });
  }
});

// PUT /api/lieux/:id/statut - Modifier le statut d'un lieu (admin seulement)
router.put('/:id/statut', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { statut } = req.body;
    
    if (!['EN_ATTENTE', 'VALIDE', 'REFUSE'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const lieu = await prisma.lieu.update({
      where: { id: req.params.id },
      data: { statut },
      include: {
        utilisateur: {
          select: { nom: true, type: true }
        }
      }
    });

    res.json({
      message: 'Statut modifié avec succès',
      lieu
    });

  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du statut' });
  }
});

module.exports = router;