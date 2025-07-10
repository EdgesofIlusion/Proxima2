console.log('🔍 Début du test Prisma...');

// Charger explicitement le .env
require('dotenv').config();

console.log('📋 Variable DATABASE_URL:', process.env.DATABASE_URL ? 'trouvée' : 'NON trouvée');

try {
  console.log('📦 Import de PrismaClient...');
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ Import réussi');
  
  console.log('🏗️ Création du client...');
  const prisma = new PrismaClient();
  console.log('✅ Client créé');
  
  console.log('🔌 Test de connexion...');
  prisma.$connect().then(() => {
    console.log('✅ Connexion réussie !');
    process.exit(0);
  }).catch((error) => {
    console.log('❌ Erreur connexion:', error.message);
    process.exit(1);
  });
  
} catch (error) {
  console.log('❌ Erreur générale:', error.message);
  process.exit(1);
}