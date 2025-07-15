require('dotenv').config(); 
const { PrismaClient } = require('@prisma/client'); 
const bcrypt = require('bcryptjs'); 
 
const prisma = new PrismaClient(); 
 
async function main() { 
  console.log('🌱 Ajout des données de test...'); 
 
  // Suppression des données existantes 
  await prisma.commentaire.deleteMany(); 
  await prisma.lieu.deleteMany(); 
  await prisma.utilisateur.deleteMany(); 
 
  // Création des utilisateurs 
  const motDePasseHash = await bcrypt.hash('password123', 10); 
 
  const user1 = await prisma.utilisateur.create({ 
    data: { nom: 'Jean Dupont', email: 'jean@test.com', mot_de_passe: motDePasseHash, type: 'USER' } 
  }); 
 
  const user2 = await prisma.utilisateur.create({ 
    data: { nom: 'Marie Martin', email: 'marie@test.com', mot_de_passe: motDePasseHash, type: 'PROPRIO' } 
  }); 
 
  const admin = await prisma.utilisateur.create({ 
    data: { nom: 'Admin Proxima', email: 'admin@proxima.com', mot_de_passe: motDePasseHash, type: 'ADMIN' } 
  }); 
 
  // Création des lieux 
  await prisma.lieu.create({ 
    data: { 
      titre: 'Place du Capitole - Toulouse', 
      description: 'Magnifique place historique au cœur de Toulouse', 
      type: 'HISTORIQUE', adresse: 'Place du Capitole', ville: 'Toulouse', 
      latitude: 43.6043, longitude: 1.4437, 
      accessibilite: 'Accès PMR complet', bruit: 'Modéré', lumiere: 'Excellente', 
      images: ['capitole1.jpg'], utilisateur_id: user1.id, statut: 'APPROUVE' 
    } 
  }); 
 
  console.log('✅ Données de test ajoutées !'); 
} 
 
main().catch(console.error).finally(() => prisma.$disconnect()); 
