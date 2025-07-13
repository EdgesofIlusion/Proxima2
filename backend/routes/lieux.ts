import { Router, Request, Response } from 'express'; 
import { PrismaClient } from '@prisma/client'; 
import { ApiResponse, CreateLieuDto, LieuxQuery, AuthRequest } from '../types'; 
import { authenticateToken } from '../middleware/auth'; 
 
const router = Router(); 
const prisma = new PrismaClient(); 
 
// Obtenir tous les lieux 
router.get('/', async (req: Request, res: Response) => { 
  try { 
    const { 
      page = 1, 
      limit = 10, 
      ville, 
      type, 
      statut = 'APPROUVE', 
      search, 
      sortBy = 'date_creation', 
      sortOrder = 'desc' 
    }: LieuxQuery = req.query as any; 
 
    const skip = (Number(page) - 1) * Number(limit); 
 
    const where: any = { statut }; 
    if (ville) where.ville = { contains: ville, mode: 'insensitive' }; 
    if (type) where.type = type; 
    if (search) { 
      where.OR = [ 
        { titre: { contains: search, mode: 'insensitive' } }, 
        { description: { contains: search, mode: 'insensitive' } }, 
        { adresse: { contains: search, mode: 'insensitive' } } 
      ]; 
    } 
 
    const total = await prisma.lieu.count({ where }); 
 
    const lieux = await prisma.lieu.findMany({ 
      where, 
      include: { 
        utilisateur: { 
          select: { 
            id: true, 
            nom: true, 
            type: true 
          } 
        }, 
        _count: { 
          select: { 
            commentaires: true 
          } 
        } 
      }, 
      orderBy: { [sortBy]: sortOrder }, 
      skip, 
      take: Number(limit) 
    }); 
 
    const response: ApiResponse = { 
      success: true, 
      data: lieu, 
      timestamp: new Date().toISOString() 
    }; 
 
    res.json(response); 
  } catch (error) { 
    console.error('Erreur r‚cup‚ration lieu:', error); 
    res.status(500).json({ 
      success: false, 
      error: { message: 'Erreur lors de la r‚cup‚ration du lieu' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}); 
 
// Cr‚er un nouveau lieu 
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => { 
  try { 
    const userId = req.user!.id; 
    const data: CreateLieuDto = req.body; 
 
    if (!data.titre || !data.description || !data.adresse || !data.ville) { 
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Champs requis: titre, description, adresse, ville' }, 
        timestamp: new Date().toISOString() 
      }); 
    } 
 
    const lieu = await prisma.lieu.create({ 
      data: { 
        ...data, 
        utilisateur_id: userId, 
        images: data.images || [] 
      }, 
      include: { 
        utilisateur: { 
          select: { 
            id: true, 
            nom: true, 
            type: true 
          } 
        } 
      } 
    }); 
 
    const response: ApiResponse = { 
      success: true, 
      data: lieu, 
      timestamp: new Date().toISOString() 
    }; 
 
    res.status(201).json(response); 
  } catch (error) { 
    console.error('Erreur cr‚ation lieu:', error); 
    res.status(500).json({ 
      success: false, 
      error: { message: 'Erreur lors de la cr‚ation du lieu' }, 
      timestamp: new Date().toISOString() 
    }); 
  } 
}); 
 
export default router; 
