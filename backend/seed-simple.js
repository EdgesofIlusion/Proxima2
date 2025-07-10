require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Test de connexion...');
  
  // Test simple
  const count = await prisma.utilisateur.count();
  console.log('✅ Connexion OK, utilisateurs:', count);
  
  console.log('✅ Seed simple terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
