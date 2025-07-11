// src/app.ts - Application Express en TypeScript
import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, AppConfig } from './types';

// Configuration de l'application
const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001'),
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: 10,
    timeout: 5000
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  cors: {
    origin: config?.environment === 'production' 
      ? ['https://proxima.com', 'https://www.proxima.com'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }
};

// Initialisation de l'application
const app: Application = express();
const prisma = new PrismaClient({
  log: config.environment === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Configuration CORS sécurisée
const corsOptions = {
  origin: config.cors.origin,
  credentials: config.cors.credentials,
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

// Middleware de logging simple
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`📥 ${timestamp} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes de base
app.get('/', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      message: 'Proxima API v1.0 - TypeScript',
      status: 'operational',
      environment: config.environment,
      version: '1.0.0'
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Route de test de la base de données
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    
    const userCount = await prisma.utilisateur.count();
    const lieuCount = await prisma.lieu.count();
    
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Base de données connectée !',
        status: 'PostgreSQL OK',
        statistics: {
          utilisateurs: userCount,
          lieux: lieuCount
        }
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Erreur de connexion à la base de données',
        details: config.environment === 'development' ? error.message : undefined
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json(response);
  }
});

// Route de santé pour monitoring
app.get('/health', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime)
      },
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024),
        total: Math.round(memory.heapTotal / 1024 / 1024),
        external: Math.round(memory.external / 1024 / 1024),
        unit: 'MB'
      },
      environment: config.environment,
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Gestion des erreurs 404
app.use('*', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: {
      message: 'Route non trouvée',
      code: 'ROUTE_NOT_FOUND'
    },
    timestamp: new Date().toISOString()
  };
  
  res.status(404).json(response);
});

// Middleware de gestion d'erreurs globales
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erreur:', error);
  
  const response: ApiResponse = {
    success: false,
    error: {
      message: error.message || 'Erreur interne du serveur',
      code: error.code || 'INTERNAL_ERROR',
      details: config.environment === 'development' ? error.stack : undefined
    },
    timestamp: new Date().toISOString()
  };
  
  res.status(error.statusCode || 500).json(response);
});

// Fonction utilitaire pour formater l'uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

// Export de l'app et de la configuration
export { app, prisma, config };