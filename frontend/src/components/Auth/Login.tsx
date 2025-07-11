import React, { useState } from 'react';
import { api } from '../../services/api';

interface LoginProps {
  onLogin: (user: any) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implémenter l'API de connexion
      // Pour l'instant, on simule avec les comptes de test
      if (email === 'jean@test.com' && password === 'password123') {
        const user = {
          id: '1',
          nom: 'Jean Dupont',
          email: 'jean@test.com',
          type: 'USER'
        };
        onLogin(user);
      } else if (email === 'admin@proxima.com' && password === 'password123') {
        const user = {
          id: '3',
          nom: 'Admin Proxima',
          email: 'admin@proxima.com',
          type: 'ADMIN'
        };
        onLogin(user);
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔐 Connexion</h2>
      
      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffebee',
          padding: '0.5rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email :
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="jean@test.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Mot de passe :
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="password123"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#95a5a6' : '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>Pas encore de compte ?</p>
        <button
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#3498db',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Créer un compte
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f4fd',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Comptes de test :</strong><br />
        • jean@test.com / password123<br />
        • admin@proxima.com / password123
      </div>
    </div>
  );
};

export default Login;