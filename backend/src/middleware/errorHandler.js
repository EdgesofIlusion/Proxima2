// src/middleware/errorHandler.js - Gestionnaire d'erreurs centralisé
const { errorLogger } = require('./logger');

// Classes d'erreurs personnalisées
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Non autorisé') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Accès interdit') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Ressource non trouvée') {
    super(message, 404);
  }
}

// Gestionnaire d'erreurs Prisma
const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      return new ValidationError(
        'Cette ressource existe déjà',
        [`Le champ ${error.meta?.target} doit être unique`]
      );
    
    case 'P2025':
      return new NotFoundError('Ressource non trouvée');
    
    case 'P2003':
      return new ValidationError(
        'Contrainte de clé étrangère violée',
        ['Une relation requise est manquante']
      );
    
    case 'P2021':
      return new AppError('Table non trouvée dans la base de données', 500);
    
    default:
      return new AppError('Erreur de base de données', 500);
  }
};

// Gestionnaire d'erreurs JWT
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Token invalide');
  }
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expiré');
  }
  return new AuthenticationError('Erreur d\'authentification');
};

// Fonction principale de gestion d'erreurs
const errorHandler = (error, req, res, next) => {
  // Log de l'erreur
  errorLogger(error, req, res, () => {});

  let err = { ...error };
  err.message = error.message;

  // Gestion des erreurs Prisma
  if (error.code && error.code.startsWith('P')) {
    err = handlePrismaError(error);
  }

  // Gestion des erreurs JWT
  if (error.name && (error.name.includes('JWT') || error.name.includes('Token'))) {
    err = handleJWTError(error);
  }

  // Gestion des erreurs de validation Express
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map(val => val.message);
    err = new ValidationError('Données invalides', details);
  }

  // Gestion des erreurs de cast MongoDB/Prisma
  if (error.name === 'CastError') {
    err = new ValidationError('ID de ressource invalide');
  }

  // Réponse d'erreur
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      message: err.message || 'Erreur interne du serveur',
      status: err.status || 'error',
      ...(err.details && { details: err.details })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // En développement, inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    console.error('💥 Erreur détaillée:', err);
  }

  res.status(statusCode).json(response);
};

// Gestionnaire pour les promesses rejetées non capturées
const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 REJET DE PROMESSE NON GÉRÉ:', reason);
    console.log('🔄 Arrêt du serveur...');
    
    server.close(() => {
      process.exit(1);
    });
  });
};

// Gestionnaire pour les exceptions non capturées
const handleUncaughtException = () => {
  process.on('uncaughtException', (error) => {
    console.error('💥 EXCEPTION NON CAPTURÉE:', error);
    console.log('🔄 Arrêt du serveur...');
    process.exit(1);
  });
};

module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleUnhandledRejection,
  handleUncaughtException
};