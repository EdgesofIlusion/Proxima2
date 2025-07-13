import 'dotenv/config'; 
import express, { Application, Request, Response, NextFunction } from 'express'; 
import cors from 'cors'; 
import helmet from 'helmet'; 
import { PrismaClient } from '@prisma/client'; 
import { ApiResponse, AppConfig } from './types'; 
import apiRoutes from './routes'; 
 
// Configuration 
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
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true 
  } 
}; 
 
const app: Application = express(); 
const prisma = new PrismaClient({ 
  log: config.environment === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'], 
}); 
 
// Middlewares 
app.use(helmet({ 
  contentSecurityPolicy: { 
    directives: { 
      defaultSrc: ["'self'"], 
      styleSrc: ["'self'", "'unsafe-inline'"], 
      scriptSrc: ["'self'"], 
      imgSrc: ["'self'", "data:", "https:"], 
      connectSrc: ["'self'"] 
    } 
  } 
})); 
 
app.use(cors(config.cors)); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
 
// Middleware de logging 
app.use((req: Request, res: Response, next: NextFunction) => { 
  const timestamp = new Date().toISOString(); 
  console.log(`?? ${timestamp} - ${req.method} ${req.originalUrl}`); 
  next(); 
}); 
 
// Route principale 
app.get('/', (req: Request, res: Response) => { 
  const response: ApiResponse = { 
    success: true, 
    data: { 
      message: 'Proxima API v1.0 - TypeScript', 
      status: 'operational', 
      environment: config.environment, 
      version: '1.0.0', 
      endpoints: { 
        api: '/api', 
        health: '/api/health', 
        auth: '/api/auth', 
        lieux: '/api/lieux' 
      } 
    }, 
    timestamp: new Date().toISOString() 
  }; 
  res.json(response); 
}); 
 
// Routes API 
app.use('/api', apiRoutes); 
 
// Route de test DB 
app.get('/test-db', async (req: Request, res: Response) => { 
  try { 
    await prisma.$connect(); 
    const userCount = await prisma.utilisateur.count(); 
    const lieuCount = await prisma.lieu.count(); 
    const response: ApiResponse = { 
      success: true, 
      data: { 
        message: 'Base de donn‚es connect‚e !', 
        stats: { 
          utilisateurs: userCount, 
          lieux: lieuCount 
        }, 
        connection: 'active' 
      }, 
      timestamp: new Date().toISOString() 
    }; 
    res.json(response); 
  } catch (error) { 
    console.error('Erreur connexion DB:', error); 
    res.status(500).json({ 
      success: false, 
      error: { 
        message: 'Erreur de connexion … la base de donn‚es', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}); 
 
// Middleware de gestion d'erreurs 
app.use((error: any, req: Request, res: Response, next: NextFunction) => { 
  console.error('? Erreur serveur:', error); 
  const response: ApiResponse = { 
    success: false, 
    error: { 
      message: 'Erreur interne du serveur', 
      code: error.code || 'INTERNAL_ERROR', 
      details: config.environment === 'development' ? error.message : undefined 
    }, 
    timestamp: new Date().toISOString() 
  }; 
  res.status(500).json(response); 
}); 
 
// Route 404 
app.use('*', (req: Request, res: Response) => { 
  res.status(404).json({ 
    success: false, 
    error: { message: `Route ${req.originalUrl} non trouv‚e` }, 
    timestamp: new Date().toISOString() 
  }); 
}); 
 
export { app, prisma, config }; 
