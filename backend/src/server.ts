// src/server.ts - Point d'entrée TypeScript
import { app, prisma, config } from './app';
import { Server } from 'http';

let server: Server;

// Gestion gracieuse de l'arrêt
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🔄 Signal ${signal} reçu. Arrêt gracieux du serveur...`);
  
  try {
    // Arrêt du serveur HTTP
    if (server) {
      server.close(() => {
        console.log('✅ Serveur HTTP fermé');
      });
    }
    
    // Déconnexion de la base de données
    await prisma.$disconnect();
    console.log('✅ Base de données déconnectée');
    
    console.log('✅ Arrêt gracieux terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt gracieux:', error);
    process.exit(1);
  }
};

// Gestionnaires de signaux
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  console.error('❌ Rejet de promesse non géré:', promise, 'raison:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Exception non capturée:', error);
  gracefulShutdown('uncaughtException');
});

// Fonction de démarrage du serveur
const startServer = async (): Promise<Server> => {
  try {
    console.log('🚀 Démarrage de Proxima Backend...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test de la connexion à la base de données
    console.log('🔌 Connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Démarrage du serveur HTTP
    server = app.listen(config.port, () => {
      console.log('✅ Serveur HTTP démarré avec succès !');
      console.log(`📡 Port: ${config.port}`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
      console.log(`🏥 Health: http://localhost:${config.port}/health`);
      console.log(`🧪 Test DB: http://localhost:${config.port}/test-db`);
      console.log(`🔧 Environnement: ${config.environment}`);
      console.log(`🔒 Mode: ${config.environment === 'production' ? 'Production' : 'Développement'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 Proxima Backend prêt à recevoir des requêtes !');
    });

    // Configuration du timeout du serveur
    server.timeout = 30000; // 30 secondes
    server.keepAliveTimeout = 5000; // 5 secondes
    server.headersTimeout = 6000; // 6 secondes

    return server;
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    console.error('💡 Vérifiez que PostgreSQL est démarré et accessible');
    console.error('💡 Vérifiez la variable DATABASE_URL dans .env');
    process.exit(1);
  }
};

// Lancement du serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer().catch((error) => {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  });
}

export { startServer, app, prisma, config };