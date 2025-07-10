const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Proxima fonctionne !',
    status: 'OK'
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
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

app.listen(PORT, () => {
  console.log('Serveur Proxima sur port 3001');
});