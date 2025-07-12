import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // TODO: Connecter au backend
  };

  return (
    <div className="container">
      <h2>?? Proxima - Connexion</h2>
      <p>Plateforme de rep‚rage de lieux de tournage</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Se connecter
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Pas de compte ? <a href="/register">S'inscrire</a>
      </p>
    </div>
  );
};

export default LoginForm;
