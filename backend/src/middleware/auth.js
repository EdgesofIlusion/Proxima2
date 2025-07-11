const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requis' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.userId },
      select: { id: true, nom: true, email: true, type: true }
    });
    if (!user) return res.status(401).json({ success: false, message: 'Token invalide' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

module.exports = { auth };
