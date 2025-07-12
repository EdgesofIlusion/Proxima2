import React from 'react';

const App = () => {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#007bff', marginBottom: '10px' }}>
        ?? Proxima
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Plateforme de rep‚rage de lieux de tournage
      </p>
      <div style={{
        border: '1px solid #ddd',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Connexion</h3>
        <input 
          type="email" 
          placeholder="Email" 
          style={{
            width: '100%',
            padding: '12px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }} 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          style={{
            width: '100%',
            padding: '12px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }} 
        />
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '10px'
        }}>
          Se connecter
        </button>
        <p style={{ marginTop: '20px', color: '#666' }}>
          Pas de compte ? <a href="#" style={{ color: '#007bff' }}>S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default App;
