// src/server.js - Point d'entrée du serveur
const { app, prisma } = require('./app');

const PORT = process.env.PORT || 3001;

// Gestion gracieuse de l'arrêt
const gracefulShutdown = async () => {
  console.log('\n🔄 Arrêt gracieux du serveur...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Base de données déconnectée');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
};

// Gestionnaires de signaux
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejet de promesse non géré:', promise, 'raison:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  gracefulShutdown();
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de la connexion DB
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Démarrage du serveur HTTP
    const server = app.listen(PORT, () => {
      console.log('🚀 Serveur Proxima démarré avec succès !');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // Configuration du timeout
    server.timeout = 30000; // 30 secondes

    return server;
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancement
if (require.main === module) {
  startServer();
}

module.exports = { startServer };