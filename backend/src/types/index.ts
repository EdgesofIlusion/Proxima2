// src/types/index.ts - Types principaux de Proxima
import { Request } from 'express';

// Types Prisma générés
export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  mot_de_passe: string;
  type: TypeUtilisateur;
  date_inscription: Date;
  lieux?: Lieu[];
  commentaires?: Commentaire[];
}

export interface Lieu {
  id: string;
  titre: string;
  description: string;
  type: TypeLieu;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  accessibilite?: string;
  bruit?: string;
  lumiere?: string;
  images: string[];
  utilisateur_id: string;
  date_creation: Date;
  statut: StatutLieu;
  utilisateur?: Utilisateur;
  commentaires?: Commentaire[];
}

export interface Commentaire {
  id: string;
  lieu_id: string;
  auteur_id: string;
  texte: string;
  video_lien?: string;
  date: Date;
  lieu?: Lieu;
  auteur?: Utilisateur;
}

// Enums
export enum TypeUtilisateur {
  USER = 'USER',
  PROPRIO = 'PROPRIO',
  ADMIN = 'ADMIN'
}

export enum TypeLieu {
  INTERIEUR = 'INTERIEUR',
  EXTERIEUR = 'EXTERIEUR',
  HISTORIQUE = 'HISTORIQUE',
  MODERNE = 'MODERNE',
  NATUREL = 'NATUREL',
  URBAIN = 'URBAIN'
}

export enum StatutLieu {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVE = 'APPROUVE',
  REJETE = 'REJETE'
}

// Types de requête étendus
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: TypeUtilisateur;
  };
}

// DTOs (Data Transfer Objects)
export interface CreateUtilisateurDto {
  nom: string;
  email: string;
  mot_de_passe: string;
  type?: TypeUtilisateur;
}

export interface LoginDto {
  email: string;
  mot_de_passe: string;
}

export interface CreateLieuDto {
  titre: string;
  description: string;
  type: TypeLieu;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  accessibilite?: string;
  bruit?: string;
  lumiere?: string;
  images?: string[];
}

export interface UpdateLieuDto {
  titre?: string;
  description?: string;
  type?: TypeLieu;
  adresse?: string;
  ville?: string;
  latitude?: number;
  longitude?: number;
  accessibilite?: string;
  bruit?: string;
  lumiere?: string;
  images?: string[];
  statut?: StatutLieu;
}

export interface CreateCommentaireDto {
  lieu_id: string;
  texte: string;
  video_lien?: string;
}

// Types de réponse API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  timestamp: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LieuxQuery extends PaginationQuery {
  ville?: string;
  type?: TypeLieu;
  statut?: StatutLieu;
  search?: string;
}

// Types pour les middlewares
export interface JwtPayload {
  id: string;
  email: string;
  type: TypeUtilisateur;
  iat?: number;
  exp?: number;
}

// Types d'erreur personnalisés
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

// Types de configuration
export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  timeout?: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  jwt: JwtConfig;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

// Types pour les logs
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
  error?: any;
}

// Types pour les validations
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Export des types Prisma générés (quand disponibles)
export type {
  Utilisateur as PrismaUtilisateur,
  Lieu as PrismaLieu,
  Commentaire as PrismaCommentaire
} from '@prisma/client';