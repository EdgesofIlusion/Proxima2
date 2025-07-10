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
    data: {
      nom: 'Jean Dupont',
      email: 'jean@test.com',
      mot_de_passe: motDePasseHash,
      type: 'USER'
    }
  });

  const user2 = await prisma.utilisateur.create({
    data: {
      nom: 'Marie Martin',
      email: 'marie@test.com',
      mot_de_passe: motDePasseHash,
      type: 'PROPRIO'
    }
  });

  const admin = await prisma.utilisateur.create({
    data: {
      nom: 'Admin Proxima',
      email: 'admin@proxima.com',
      mot_de_passe: motDePasseHash,
      type: 'ADMIN'
    }
  });

  // Création des lieux
  const lieu1 = await prisma.lieu.create({
    data: {
      titre: 'Place du Capitole - Toulouse',
      description: 'Magnifique place historique au cœur de Toulouse, parfaite pour des scènes urbaines',
      type: 'HISTORIQUE',
      adresse: 'Place du Capitole',
      ville: 'Toulouse',
      latitude: 43.6043,
      longitude: 1.4437,
      accessibilite: 'Accès PMR complet',
      bruit: 'Modéré - circulation urbaine',
      lumiere: 'Excellente lumière naturelle',
      images: ['capitole1.jpg', 'capitole2.jpg'],
      utilisateur_id: user1.id,
      statut: 'APPROUVE'
    }
  });

  const lieu2 = await prisma.lieu.create({
    data: {
      titre: 'Jardin du Luxembourg - Paris',
      description: 'Parc parisien emblématique avec bassins et allées',
      type: 'NATUREL',
      adresse: 'Rue de Médicis',
      ville: 'Paris',
      latitude: 48.8462,
      longitude: 2.3372,
      accessibilite: 'Partiellement accessible',
      bruit: 'Calme',
      lumiere: 'Variable selon météo',
      images: ['luxembourg1.jpg'],
      utilisateur_id: user2.id,
      statut: 'APPROUVE'
    }
  });

  const lieu3 = await prisma.lieu.create({
    data: {
      titre: 'Vieux Port - Marseille',
      description: 'Port historique marseillais avec vue sur la mer',
      type: 'EXTERIEUR',
      adresse: 'Quai du Port',
      ville: 'Marseille',
      latitude: 43.2965,
      longitude: 5.3698,
      accessibilite: 'Accessible',
      bruit: 'Modéré - activité portuaire',
      lumiere: 'Excellente en journée',
      images: ['marseille1.jpg', 'marseille2.jpg'],
      utilisateur_id: user1.id,
      statut: 'EN_ATTENTE'
    }
  });

  // Création des commentaires
  await prisma.commentaire.create({
    data: {
      texte: 'Lieu magnifique, parfait pour notre tournage !',
      lieu_id: lieu1.id,
      auteur_id: user2.id
    }
  });

  await prisma.commentaire.create({
    data: {
      texte: 'Attention aux autorisations nécessaires pour filmer ici.',
      lieu_id: lieu2.id,
      auteur_id: admin.id
    }
  });

  console.log('✅ Données de test ajoutées !');
  console.log('👤 Utilisateurs créés : 3');
  console.log('📍 Lieux créés : 3');
  console.log('💬 Commentaires créés : 2');
  
  console.log('\n🔑 Comptes de test :');
  console.log('User: jean@test.com / password123');
  console.log('Propriétaire: marie@test.com / password123');
  console.log('Admin: admin@proxima.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });