require('dotenv').config();

console.log('🔍 Debug Prisma...');

try {
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ PrismaClient importé');
  
  const prisma = new PrismaClient();
  console.log('✅ Client créé');
  
  console.log('📋 Propriétés disponibles:');
  console.log('- prisma.utilisateur:', typeof prisma.utilisateur);
  console.log('- prisma.lieu:', typeof prisma.lieu);
  console.log('- prisma.commentaire:', typeof prisma.commentaire);
  
} catch (error) {
  console.log('❌ Erreur:', error.message);
}