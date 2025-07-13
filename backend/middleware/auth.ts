import { Request, Response, NextFunction } from 'express'; 
import jwt from 'jsonwebtoken'; 
import { AuthRequest, JwtPayload } from '../types'; 
 
export const authenticateToken = ( 
  req: AuthRequest, 
  res: Response, 
  next: NextFunction 
) => { 
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 
 
  if (!token) { 
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Token d\'accäs requis' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
 
  try { 
    const decoded = jwt.verify( 
      token, 
      process.env.JWT_SECRET || 'default-secret' 
    ) as JwtPayload; 
    req.user = decoded; 
    next(); 
  } catch (error) { 
    return res.status(403).json({ 
      success: false, 
      error: { message: 'Token invalide' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}; 
 
export const requireAdmin = ( 
  req: AuthRequest, 
  res: Response, 
  next: NextFunction 
) => { 
  if (!req.user || req.user.type !== 'ADMIN') { 
    return res.status(403).json({ 
      success: false, 
      error: { message: 'Accäs administrateur requis' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
  next(); 
}; 
