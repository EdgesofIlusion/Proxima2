require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes API
const authRoutes = require('./src/routes/auth');
const lieuRoutes = require('./src/routes/lieux');
const commentaireRoutes = require('./src/routes/commentaires');
const adminRoutes = require('./src/routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/lieux', lieuRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/admin', adminRoutes);

// Fichiers statiques
app.use('/uploads', express.static('uploads'));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Proxima API', status: 'OK', version: '1.0' });
});

app.listen(PORT, () => {
  console.log(`?? Serveur Proxima sur port ${PORT}`);
});
