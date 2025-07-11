// src/middleware/logger.js - Middleware de logging professionnel
const fs = require('fs');
const path = require('path');

// Création du dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Fonction de formatage des logs
const formatLog = (req, res, duration, error = null) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const status = res.statusCode;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';
  
  const logEntry = {
    timestamp,
    method,
    url,
    status,
    duration: `${duration}ms`,
    ip,
    userAgent,
    ...(error && { error: error.message })
  };

  return JSON.stringify(logEntry);
};

// Fonction d'écriture des logs
const writeLog = (logEntry, type = 'access') => {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${type}-${date}.log`);
  
  fs.appendFileSync(logFile, logEntry + '\n', 'utf8');
};

// Middleware principal de logging
const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log de la requête entrante
  const requestLog = {
    timestamp: new Date().toISOString(),
    type: 'REQUEST',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  };

  // Log en développement dans la console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📥 ${req.method} ${req.originalUrl} - ${requestLog.ip}`);
  }

  // Override de res.end pour capturer la réponse
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    const logEntry = formatLog(req, res, duration);
    
    // Écriture du log
    writeLog(logEntry, res.statusCode >= 400 ? 'error' : 'access');
    
    // Log en développement dans la console
    if (process.env.NODE_ENV !== 'production') {
      const statusEmoji = res.statusCode >= 400 ? '❌' : '✅';
      console.log(`📤 ${statusEmoji} ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
    
    // Appel de la méthode originale
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Middleware de log d'erreurs
const errorLogger = (error, req, res, next) => {
  const duration = Date.now() - (req.startTime || Date.now());
  const logEntry = formatLog(req, res, duration, error);
  
  writeLog(logEntry, 'error');
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(`💥 ERREUR: ${error.message} - ${req.method} ${req.originalUrl}`);
  }
  
  next(error);
};

module.exports = { logger, errorLogger };