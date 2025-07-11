// src/middleware/errorHandler.js - Version simple pour démarrer
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Erreur interne du serveur',
      status: err.status || 500
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;