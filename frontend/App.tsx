import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css'; 
import HomePage from './pages/HomePage'; 
import LieuxPage from './pages/LieuxPage'; 
import AuthPage from './pages/AuthPage'; 
 
function App() { 
  return ( 
    <Router> 
      <div className="App"> 
        <header className="App-header"> 
          <nav> 
            <h1>?? Proxima</h1> 
            <div> 
              <a href="/">Accueil</a> 
              <a href="/lieux">Lieux</a> 
              <a href="/auth">Connexion</a> 
            </div> 
          </nav> 
        </header> 
        <main> 
          <Routes> 
            <Route path="/" element={<HomePage />} /> 
            <Route path="/lieux" element={<LieuxPage />} /> 
            <Route path="/auth" element={<AuthPage />} /> 
          </Routes> 
        </main> 
      </div> 
    </Router> 
  ); 
} 
 
export default App; 
