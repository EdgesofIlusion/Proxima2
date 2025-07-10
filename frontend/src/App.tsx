import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Lieu } from './types';
import './App.css';

function App() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les lieux depuis le backend
    const fetchLieux = async () => {
      try {
        const response = await api.get('/test-db');
        console.log('Backend connecté:', response.data);
        
        // Pour l'instant, on simule des lieux
        const lieuxSimules: Lieu[] = [
          {
            id: '1',
            titre: 'Place du Capitole - Toulouse',
            ville: 'Toulouse',
            latitude: 43.6043,
            longitude: 1.4437
          },
          {
            id: '2', 
            titre: 'Jardin du Luxembourg - Paris',
            ville: 'Paris',
            latitude: 48.8462,
            longitude: 2.3372
          }
        ];
        
        setLieux(lieuxSimules);
        setLoading(false);
      } catch (error) {
        console.error('Erreur connexion backend:', error);
        setLoading(false);
      }
    };

    fetchLieux();
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <h1>🎬 Proxima - Repérage de Lieux</h1>
        <nav>
          <a href="/" style={{color: 'white', marginRight: '1rem'}}>Accueil</a>
          <a href="/carte" style={{color: 'white', marginRight: '1rem'}}>Carte</a>
          <a href="/connexion" style={{color: 'white'}}>Connexion</a>
        </nav>
      </header>

      {/* Contenu principal */}
      <main style={{padding: '0 2rem'}}>
        <h2>Bienvenue sur Proxima</h2>
        <p>Plateforme collaborative de repérage de lieux pour tournages et shootings</p>
        
        <div style={{marginTop: '2rem'}}>
          <h3>🗺️ Lieux disponibles</h3>
          
          {loading ? (
            <p>Chargement des lieux...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {lieux.map(lieu => (
                <div key={lieu.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4>{lieu.titre}</h4>
                  <p><strong>Ville:</strong> {lieu.ville}</p>
                  <p><strong>Coordonnées:</strong> {lieu.latitude}, {lieu.longitude}</p>
                  <button style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    Voir détails
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          backgroundColor: '#ecf0f1',
          borderRadius: '8px'
        }}>
          <h3>🚀 Statut des services</h3>
          <p>✅ Frontend React: Opérationnel</p>
          <p>✅ Backend Express: Connecté (Port 3001)</p>
          <p>✅ Base PostgreSQL: Connectée</p>
          <p>🔄 Carte interactive: En développement</p>
        </div>
      </main>
    </div>
  );
}

export default App;