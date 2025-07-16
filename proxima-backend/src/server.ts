// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Configuration
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARES =====
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://proxima.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES DE BASE =====

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Proxima API v1.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Proxima API v1.0'
  });
});

// Test DB
app.get('/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    const lieuCount = await prisma.lieu.count();
    
    res.json({ 
      status: 'DB Connected',
      data: { users: userCount, lieux: lieuCount },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ 
      status: 'DB Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== API ROUTES =====
// TODO: Ajouter les routes auth, lieux, reservations

// 404 Handler - version corrigée
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ===== START SERVER =====
const startServer = async () => {
  try {
    // Test connexion DB
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Démarrage serveur
    app.listen(PORT, () => {
      console.log(`🚀 Proxima API running on port ${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
      console.log(`🔧 Test DB: http://localhost:${PORT}/test-db`);
      console.log(`📱 Ready for frontend on http://localhost:3000`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Gestion arrêt propre
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();