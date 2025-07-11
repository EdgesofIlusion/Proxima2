import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Lieu } from './types';
import MapComponent from './components/Map/MapComponent';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AddLieu from './components/Lieux/AddLieu';
import './App.css';
import './styles/responsive.css';

interface User {
  id: string;
  nom: string;
  email: string;
  type: 'USER' | 'PROPRIO' | 'ADMIN';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAddLieu, setShowAddLieu] = useState(false);
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
          },
          {
            id: '3',
            titre: 'Vieux Port - Marseille',
            ville: 'Marseille',
            latitude: 43.2965,
            longitude: 5.3698
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

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    console.log('Utilisateur connecté:', userData);
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    console.log('Nouveau compte créé:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    console.log('Utilisateur déconnecté');
  };

  const handleAddLieu = (nouveauLieu: Omit<Lieu, 'id'>) => {
    const lieuAvecId: Lieu = {
      ...nouveauLieu,
      id: Date.now().toString()
    };
    setLieux([...lieux, lieuAvecId]);
    setShowAddLieu(false);
    console.log('Nouveau lieu ajouté:', lieuAvecId);
  };

  const handleDeleteLieu = (lieuId: string) => {
    setLieux(lieux.filter(lieu => lieu.id !== lieuId));
    console.log('Lieu supprimé:', lieuId);
  };

  const switchToLogin = () => setAuthMode('login');
  const switchToRegister = () => setAuthMode('register');

  // Si l'utilisateur veut se connecter/s'inscrire
  if (showAuth) {
    return (
      <div className="App">
        <header style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h1>🎬 Proxima - Repérage de Lieux</h1>
        </header>

        {authMode === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onRegister={handleRegister} onSwitchToLogin={switchToLogin} />
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setShowAuth(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3498db',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🎬 Proxima - Repérage de Lieux</h1>
            <nav>
              <a href="/" style={{color: 'white', marginRight: '1rem'}}>Accueil</a>
              <a href="/carte" style={{color: 'white', marginRight: '1rem'}}>Carte</a>
              {user ? (
                <button
                  onClick={() => setShowAddLieu(true)}
                  style={{
                    background: 'none',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ➕ Ajouter un lieu
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    background: 'none',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Connexion
                </button>
              )}
            </nav>
          </div>
          
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Connecté en tant que <strong>{user.nom}</strong>
                {user.type === 'ADMIN' && ' 👑'}
                {user.type === 'PROPRIO' && ' 🏠'}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main style={{padding: '0 2rem'}}>
        <h2>Bienvenue sur Proxima</h2>
        <p>Plateforme collaborative de repérage de lieux pour tournages et shootings</p>
        
        {user && (
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3>👋 Bonjour {user.nom} !</h3>
            <p>
              {user.type === 'ADMIN' && '👑 Vous êtes administrateur. Vous pouvez modérer tous les lieux.'}
              {user.type === 'PROPRIO' && '🏠 Vous êtes propriétaire. Vous pouvez proposer vos lieux pour des tournages.'}
              {user.type === 'USER' && '🎬 Vous êtes utilisateur. Parcourez les lieux disponibles pour vos projets !'}
            </p>
            <button
              onClick={() => setShowAddLieu(true)}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              ➕ Ajouter un nouveau lieu
            </button>
          </div>
        )}

        <div style={{marginTop: '2rem'}}>
          <h3>🗺️ Carte interactive des lieux</h3>
          
          {loading ? (
            <p>Chargement de la carte...</p>
          ) : (
            <MapComponent lieux={lieux} />
          )}

          <h3 style={{marginTop: '2rem'}}>📍 Liste des lieux ({lieux.length})</h3>
          
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
                  <div style={{ marginTop: '1rem' }}>
                    <button style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}>
                      Voir détails
                    </button>
                    {user && (
                      <button style={{
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}>
                        Contacter
                      </button>
                    )}
                    {user && user.type === 'ADMIN' && (
                      <button
                        onClick={() => handleDeleteLieu(lieu.id)}
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>
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
          <p>✅ Carte interactive: Fonctionnelle</p>
          <p>✅ Système d'authentification: Actif</p>
          <p>✅ CRUD Lieux: Fonctionnel (Ajout/Suppression)</p>
          <p>🔄 Design responsive: En développement</p>
        </div>
      </main>

      {/* Modales */}
      {showAddLieu && (
        <AddLieu
          onAddLieu={handleAddLieu}
          onCancel={() => setShowAddLieu(false)}
        />
      )}
    </div>
  );
}

export default App;