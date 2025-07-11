require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes directes qui marchent
app.get('/api/lieux', (req, res) => {
  res.json({ success: true, message: 'Lieux direct works!' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Proxima fonctionne !', status: 'OK' });
});

app.listen(PORT, () => {
  console.log('Serveur Proxima sur port 3001');
});
