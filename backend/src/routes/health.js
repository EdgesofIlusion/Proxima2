// src/routes/health.js - Routes de vérification de santé
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Health check simple
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        api: 'operational',
        database: 'checking...'
      }
    };

    // Test de la base de données
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = 'operational';
    } catch (dbError) {
      healthCheck.services.database = 'error';
      healthCheck.status = 'DEGRADED';
    }

    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);

  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service indisponible',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check détaillé (pour monitoring)
router.get('/detailed', async (req, res) => {
  try {
    const startTime = Date.now();
    
    const healthDetails = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: {
        process: process.uptime(),
        formatted: formatUptime(process.uptime())
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        unit: 'MB'
      },
      services: {}
    };

    // Test API
    healthDetails.services.api = {
      status: 'operational',
      responseTime: Date.now() - startTime + 'ms'
    };

    // Test base de données avec timing
    const dbStartTime = Date.now();
    try {
      await prisma.$queryRaw`SELECT NOW()`;
      const dbCount = await prisma.utilisateur.count();
      
      healthDetails.services.database = {
        status: 'operational',
        responseTime: Date.now() - dbStartTime + 'ms',
        connection: 'active',
        userCount: dbCount
      };
    } catch (dbError) {
      healthDetails.services.database = {
        status: 'error',
        responseTime: Date.now() - dbStartTime + 'ms',
        connection: 'failed',
        error: dbError.message
      };
      healthDetails.status = 'DEGRADED';
    }

    // Test des dépendances externes si nécessaire
    healthDetails.services.external = {
      status: 'not_checked',
      message: 'External services monitoring not implemented'
    };

    const statusCode = healthDetails.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthDetails);

  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Impossible de vérifier l\'état du service',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Fonction utilitaire pour formater l'uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

module.exports = router;