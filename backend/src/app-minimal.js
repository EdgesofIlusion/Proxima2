// src/app-minimal.js - Version minimale qui marche
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middlewares de base
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Proxima API v1.0 - Nouvelle structure',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Route de test DB (comme l'ancien serveur)
app.get('/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      message: 'Base de données connectée !',
      status: 'PostgreSQL OK'
    });
    await prisma.$disconnect();
  } catch (error) {
    res.json({
      message: 'Erreur',
      erreur: error.message
    });
  }
});

module.exports = { app, prisma };