import 'dotenv/config'; 
import * as express from 'express'; 
import * as cors from 'cors'; 
import { PrismaClient } from '@prisma/client'; 
 
const app = express(); 
const prisma = new PrismaClient(); 
 
const config = { 
  port: parseInt(process.env.PORT || '3001'), 
  environment: 'development', 
  database: { url: process.env.DATABASE_URL || '' }, 
  jwt: { secret: process.env.JWT_SECRET || 'secret' }, 
  cors: { origin: ['http://localhost:3000'], credentials: true } 
}; 
 
app.use(cors()); 
app.use(express.json()); 
 
app.get('/', (req, res) => { 
  res.json({ success: true, message: 'Proxima API v1.0' }); 
}); 
 
app.get('/test-db', async (req, res) => { 
  try { 
    await prisma.$connect(); 
    const userCount = await prisma.utilisateur.count(); 
    res.json({ success: true, data: { utilisateurs: userCount } }); 
  } catch (error) { 
    res.status(500).json({ success: false, error: 'Erreur DB' }); 
  } 
}); 
 
export { app, prisma, config }; 
