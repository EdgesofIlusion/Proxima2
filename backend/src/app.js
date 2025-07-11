// src/app.js - Configuration Express principale
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');

// Import des routes
const authRoutes = require('./routes/auth');
const lieuxRoutes = require('./routes/lieux');
const commentairesRoutes = require('./routes/commentaires');
const healthRoutes = require('./routes/health');

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

// Initialisation
const app = express();
const prisma = new PrismaClient();

// Configuration CORS sécurisée
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://proxima.com', 'https://www.proxima.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares globaux
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use(logger);

// Routes API
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lieux', lieuxRoutes);
app.use('/api/commentaires', commentairesRoutes);

// Route de base pour vérifier l'API
app.get('/', (req, res) => {
  res.json({
    message: 'Proxima API v1.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `L'endpoint ${req.method} ${req.originalUrl} n'existe pas`,
    availableEndpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/login, POST /api/auth/register',
      lieux: 'GET /api/lieux, POST /api/lieux',
      commentaires: 'GET /api/commentaires, POST /api/commentaires'
    }
  });
});

// Export de l'app configurée
module.exports = { app, prisma };