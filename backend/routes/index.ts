import { Router } from 'express'; 
import authRoutes from './auth'; 
import lieuxRoutes from './lieux'; 
 
const router = Router(); 
 
// Routes principales 
router.use('/auth', authRoutes); 
router.use('/lieux', lieuxRoutes); 
 
// Route de sant‚ de l'API 
router.get('/health', (req, res) => { 
  res.json({ 
    success: true, 
    data: { 
      status: 'healthy', 
      timestamp: new Date().toISOString(), 
      uptime: process.uptime(), 
      version: '1.0.0' 
    } 
  }); 
}); 
 
export default router; 
