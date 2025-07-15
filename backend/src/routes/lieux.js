const express = require('express'); 
const { PrismaClient } = require('@prisma/client'); 
 
const prisma = new PrismaClient(); 
const router = express.Router(); 
 
// GET /api/lieux - Liste des lieux approuvés 
router.get('/', async (req, res) => { 
  try { 
    const { page = 1, limit = 10, type, ville } = req.query; 
    const skip = (parseInt(page) - 1) * parseInt(limit); 
    const where = { statut: 'APPROUVE' }; 
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
    console.error('Erreur lieux:', error); 
    res.status(500).json({ success: false, message: 'Erreur serveur' }); 
  } 
}); 
 
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
    const lieux = await prisma.lieu.findMany({ where, skip, take: parseInt(limit), include: { utilisateur: { select: { nom: true, type: true } } } }); 
    res.json({ success: true, data: { lieux } }); 
  } catch (error) { 
    res.status(500).json({ success: false, message: 'Erreur serveur' }); 
  } 
}); 
 
module.exports = router; 
