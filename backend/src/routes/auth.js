const express = require('express'); 
const { PrismaClient } = require('@prisma/client'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
 
const prisma = new PrismaClient(); 
const router = express.Router(); 
 
// POST /api/auth/login 
router.post('/login', async (req, res) => { 
  try { 
    const { email, mot_de_passe } = req.body; 
    const user = await prisma.utilisateur.findUnique({ where: { email } }); 
    if (!user || !await bcrypt.compare(mot_de_passe, user.mot_de_passe)) { 
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' }); 
    } 
    const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, process.env.JWT_SECRET || 'secret'); 
    res.json({ success: true, data: { user: { id: user.id, nom: user.nom, email: user.email, type: user.type }, token } }); 
  } catch (error) { 
    res.status(500).json({ success: false, message: 'Erreur serveur' }); 
  } 
}); 
 
module.exports = router; 
