// prisma/seed.ts
import { PrismaClient, UserRole, LieuType, LieuStatut } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyage
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.lieu.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ===== UTILISATEURS =====
  const locataire = await prisma.user.create({
    data: {
      email: 'locataire@test.com',
      password: hashedPassword,
      nom: 'Martin',
      prenom: 'Jean',
      telephone: '0123456789',
      role: UserRole.LOCATAIRE,
      verified: true
    }
  });

  const proprio = await prisma.user.create({
    data: {
      email: 'proprio@test.com',
      password: hashedPassword,
      nom: 'Dubois',
      prenom: 'Marie',
      telephone: '0987654321',
      role: UserRole.PROPRIO,
      verified: true
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@proxima.com',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'Proxima',
      role: UserRole.ADMIN,
      verified: true
    }
  });

  console.log('👥 Created users');

  // ===== LIEUX =====
  const lieu1 = await prisma.lieu.create({
    data: {
      titre: 'Loft industriel - Paris 11ème',
      description: 'Magnifique loft de 200m² avec verrière et mezzanine. Parfait pour tournages publicitaires et clips musicaux. Lumière naturelle exceptionnelle.',
      type: LieuType.INTERIEUR,
      adresse: '45 Rue de la République',
      ville: 'Paris',
      code_postal: '75011',
      latitude: 48.8566,
      longitude: 2.3522,
      superficie: 200,
      accessibilite: 'Ascenseur, accès PMR partiel',
      equipements: ['Électricité 32A', 'Wi-Fi', 'Parking', 'Toilettes'],
      prix_jour: 450.00,
      caution: 300.00,
      disponible: true,
      instant_book: true,
      images: ['loft1.jpg', 'loft2.jpg'],
      proprietaire_id: proprio.id,
      statut: LieuStatut.APPROUVE,
      verified: true
    }
  });

  const lieu2 = await prisma.lieu.create({
    data: {
      titre: 'Villa moderne - Cannes',
      description: 'Villa contemporaine avec piscine et vue mer. Architecture épurée, idéale pour productions haut de gamme.',
      type: LieuType.EXTERIEUR,
      adresse: '12 Boulevard de la Croisette',
      ville: 'Cannes',
      code_postal: '06400',
      latitude: 43.5528,
      longitude: 7.0174,
      superficie: 500,
      accessibilite: 'Plain-pied, accès total PMR',
      equipements: ['Piscine', 'Terrasse', 'Parking 5 places', 'Cuisine équipée'],
      restrictions: 'Pas de tournage de nuit après 22h',
      prix_jour: 1200.00,
      caution: 800.00,
      disponible: true,
      instant_book: false,
      images: ['villa1.jpg'],
      proprietaire_id: proprio.id,
      statut: LieuStatut.APPROUVE,
      verified: true
    }
  });

  const lieu3 = await prisma.lieu.create({
    data: {
      titre: 'Château médiéval - Loire',
      description: 'Château du XIIe siècle avec douves et parc de 10 hectares. Décors historiques authentiques.',
      type: LieuType.HISTORIQUE,
      adresse: 'Route du Château',
      ville: 'Amboise',
      code_postal: '37400',
      latitude: 47.4127,
      longitude: 0.9853,
      superficie: 1500,
      accessibilite: 'Accès limité PMR (rez-de-chaussée uniquement)',
      equipements: ['Parking bus', 'Éclairage professionnel', 'Groupes électrogènes'],
      restrictions: 'Protection monuments historiques - autorisation préfecture requise',
      prix_jour: 2500.00,
      caution: 2000.00,
      disponible: true,
      instant_book: false,
      proprietaire_id: proprio.id,
      statut: LieuStatut.EN_ATTENTE
    }
  });

  console.log('🏠 Created lieux');

  console.log('✅ Seed completed!');
  console.log(`
📊 Created:
- ${3} users (locataire, proprio, admin)
- ${3} lieux
  
🔑 Test accounts:
- Locataire: locataire@test.com / password123
- Propriétaire: proprio@test.com / password123  
- Admin: admin@proxima.com / password123
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });