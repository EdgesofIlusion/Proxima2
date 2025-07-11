import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (user: any) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validations
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implémenter l'API d'inscription
      // Pour l'instant, on simule la création d'un compte
      const newUser = {
        id: Date.now().toString(),
        nom,
        email,
        type
      };
      
      console.log('Nouveau compte créé:', newUser);
      onRegister(newUser);
    } catch (err) {
      setError('Erreur lors de la création du compte');
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
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📝 Inscription</h2>
      
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
            Nom complet :
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="Jean Dupont"
          />
        </div>

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
            placeholder="jean@example.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Type de compte :
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="USER">Utilisateur (recherche de lieux)</option>
            <option value="PROPRIO">Propriétaire (propose des lieux)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
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
            placeholder="Minimum 6 caractères"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Confirmer le mot de passe :
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="Répétez le mot de passe"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>Déjà un compte ?</p>
        <button
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#3498db',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Register;