import React from 'react';

function App() {
  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h1', null, '?? Proxima'),
      React.createElement('p', null, 'Plateforme de rep‚rage de lieux de tournage'),
      React.createElement('div', { style: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px' } },
        React.createElement('h3', null, 'Connexion'),
        React.createElement('input', { type: 'email', placeholder: 'Email', style: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' } }),
        React.createElement('input', { type: 'password', placeholder: 'Mot de passe', style: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' } }),
        React.createElement('button', { style: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } }, 'Se connecter')
      )
    )
  );
}

export default App;
