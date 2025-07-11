const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

const getAllLieux = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, ville, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { statut: 'APPROUVE' };
    if (type) where.type = type;
    if (ville) where.ville = { contains: ville, mode: 'insensitive' };
    if (search) where.OR = [
      { titre: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
    const lieux = await prisma.lieu.findMany({
      where, skip, take: parseInt(limit),
      include: { utilisateur: { select: { nom: true, type: true } } },
      orderBy: { date_creation: 'desc' }
    });
    const total = await prisma.lieu.count({ where });
    res.json({ success: true, data: { lieux, total, page: parseInt(page) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getLieuById = async (req, res) => {
  try {
    const lieu = await prisma.lieu.findUnique({
      where: { id: req.params.id },
      include: {
        utilisateur: { select: { nom: true, type: true } },
        commentaires: { include: { auteur: { select: { nom: true } } } }
      }
    });
    if (!lieu) return res.status(404).json({ success: false, message: 'Lieu non trouv‚' });
    res.json({ success: true, data: lieu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getAllLieux, getLieuById };
