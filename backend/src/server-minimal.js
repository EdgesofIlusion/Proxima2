// src/server-minimal.js
const { app } = require('./app-minimal');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 Serveur Proxima (nouvelle structure) sur port', PORT);
});