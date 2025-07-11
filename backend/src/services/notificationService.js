const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Types de notifications
const NOTIFICATION_TYPES = {
  LIEU_CREATED: 'LIEU_CREATED',
  LIEU_APPROVED: 'LIEU_APPROVED',
  LIEU_REJECTED: 'LIEU_REJECTED',
  COMMENT_ADDED: 'COMMENT_ADDED'
};

// Créer une notification
const createNotification = async (userId, type, message, relatedId = null) => {
  try {
    // Pour l'instant, on log just (plus tard: email, push, etc.)
    console.log(`📧 Notification pour user ${userId}: ${type} - ${message}`);
    return true;
  } catch (error) {
    console.error('Erreur notification:', error);
    return false;
  }
};

// Notifier les admins qu'un nouveau lieu est créé
const notifyAdminsNewLieu = async (lieu) => {
  try {
    const admins = await prisma.utilisateur.findMany({
      where: { type: 'ADMIN' },
      select: { id: true, email: true }
    });
    for (const admin of admins) {
      await createNotification(
        admin.id,
        NOTIFICATION_TYPES.LIEU_CREATED,
        `Nouveau lieu à modérer: ${lieu.titre}`,
        lieu.id
      );
    }
  } catch (error) {
    console.error('Erreur notification admins:', error);
  }
};

// Notifier l'utilisateur du statut de modération
const notifyModerationResult = async (lieu, statut) => {
  try {
    const message = statut === 'APPROUVE' ? 
      `Votre lieu "${lieu.titre}" a été approuvé !` :
      `Votre lieu "${lieu.titre}" a été rejeté.`;
    await createNotification(
      lieu.utilisateur_id,
      statut === 'APPROUVE' ? NOTIFICATION_TYPES.LIEU_APPROVED : NOTIFICATION_TYPES.LIEU_REJECTED,
      message,
      lieu.id
    );
  } catch (error) {
    console.error('Erreur notification modération:', error);
  }
};

module.exports = {
  NOTIFICATION_TYPES,
  createNotification,
  notifyAdminsNewLieu,
  notifyModerationResult
};
