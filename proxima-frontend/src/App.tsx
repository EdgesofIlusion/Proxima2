import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LieuxPage from './pages/LieuxPage';
import LoginPage from './pages/LoginPage';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex space-x-6">
      <Link 
        to="/" 
        className={`${isActive('/') ? 'text-white' : 'text-blue-200'} hover:text-white`}
      >
        Accueil
      </Link>
      <Link 
        to="/lieux" 
        className={`${isActive('/lieux') ? 'text-white' : 'text-blue-200'} hover:text-white`}
      >
        Lieux
      </Link>
      <Link 
        to="/login" 
        className={`${isActive('/login') ? 'text-white' : 'text-blue-200'} hover:text-white`}
      >
        Connexion
      </Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🎬 Proxima</h1>
              <p className="text-blue-100">Marketplace de lieux de tournage</p>
            </div>
            <Navigation />
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lieux" element={<LieuxPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;