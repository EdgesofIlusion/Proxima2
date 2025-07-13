import { Router, Request, Response } from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import { PrismaClient } from '@prisma/client'; 
import { ApiResponse, CreateUtilisateurDto, LoginDto } from '../types'; 
 
const router = Router(); 
const prisma = new PrismaClient(); 
 
// Inscription 
router.post('/register', async (req: Request, res: Response) => { 
  try { 
    const { nom, email, mot_de_passe, type }: CreateUtilisateurDto = req.body; 
 
    if (!nom || !email || !mot_de_passe) { 
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Tous les champs sont requis' }, 
        timestamp: new Date().toISOString() 
      }); 
    } 
 
    const existingUser = await prisma.utilisateur.findUnique({ 
      where: { email } 
    }); 
 
    if (existingUser) { 
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Un compte avec cet email existe d‚j…' }, 
        timestamp: new Date().toISOString() 
      }); 
    } 
 
    const hashedPassword = await bcrypt.hash(mot_de_passe, 12); 
 
    const user = await prisma.utilisateur.create({ 
      data: { 
        nom, 
        email, 
        mot_de_passe: hashedPassword, 
        type: type || 'USER' 
      }, 
      select: { 
        id: true, 
        nom: true, 
        email: true, 
        type: true, 
        date_inscription: true 
      } 
    }); 
 
    const token = jwt.sign( 
      { id: user.id, email: user.email, type: user.type }, 
      process.env.JWT_SECRET || 'default-secret', 
      { expiresIn: '24h' } 
    ); 
 
    const response: ApiResponse = { 
      success: true, 
      data: { user, token }, 
      timestamp: new Date().toISOString() 
    }; 
 
    res.status(201).json(response); 
  } catch (error) { 
    console.error('Erreur inscription:', error); 
    res.status(500).json({ 
      success: false, 
      error: { message: 'Erreur lors de l\'inscription' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}); 
 
// Connexion 
router.post('/login', async (req: Request, res: Response) => { 
  try { 
    const { email, mot_de_passe }: LoginDto = req.body; 
 
    if (!email || !mot_de_passe) { 
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Email et mot de passe requis' }, 
        timestamp: new Date().toISOString() 
      }); 
    } 
 
    const user = await prisma.utilisateur.findUnique({ 
      where: { email } 
 
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe); 
 
    if (!isPasswordValid) { 
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Email ou mot de passe incorrect' }, 
        timestamp: new Date().toISOString() 
      }); 
    } 
 
    const token = jwt.sign( 
      { id: user.id, email: user.email, type: user.type }, 
      process.env.JWT_SECRET || 'default-secret', 
      { expiresIn: '24h' } 
    ); 
 
    const response: ApiResponse = { 
      success: true, 
      data: { 
        user: { 
          id: user.id, 
          nom: user.nom, 
          email: user.email, 
          type: user.type, 
          date_inscription: user.date_inscription 
        }, 
        token 
      }, 
      timestamp: new Date().toISOString() 
    }; 
 
    res.json(response); 
  } catch (error) { 
    console.error('Erreur connexion:', error); 
    res.status(500).json({ 
      success: false, 
      error: { message: 'Erreur lors de la connexion' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}); 
 
export default router; 
