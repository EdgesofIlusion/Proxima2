import React, { useState } from 'react'; 
import { api } from '../services/api'; 
 
const AuthPage: React.FC = () => { 
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({ 
    nom: '', 
    email: '', 
    mot_de_passe: '' 
  }); 
  const [message, setMessage] = useState(''); 
 
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'; 
      const response = await api.post(endpoint, formData); 
      if (response.data.success) { 
        localStorage.setItem('token', response.data.data.token); 
        setMessage('SuccŠs ! Redirection...'); 
        setTimeout(() => window.location.href = '/', 1500); 
      } 
    } catch (error: any) { 
      setMessage(error.response?.data?.error?.message || 'Erreur'); 
    } 
  }; 
 
  return ( 
    <div className="auth-page"> 
      <div className="auth-container"> 
        <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2> 
        <form onSubmit={handleSubmit}> 
          {!isLogin && ( 
            <input 
              type="text" 
              placeholder="Nom" 
              value={formData.nom} 
              onChange={(e) => setFormData({...formData, nom: e.target.value})} 
              required 
            /> 
          )} 
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          /> 
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={formData.mot_de_passe} 
            onChange={(e) => setFormData({...formData, mot_de_passe: e.target.value})} 
            required 
          /> 
          <button type="submit"> 
            {isLogin ? 'Se connecter' : 'S\'inscrire'} 
          </button> 
        </form> 
        <p> 
          {isLogin ? 'Pas encore de compte ?' : 'D‚j… un compte ?'} 
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="link-button"> 
            {isLogin ? 'S\'inscrire' : 'Se connecter'} 
          </button> 
        </p> 
        {message && <div className="message">{message}</div>} 
      </div> 
    </div> 
  ); 
}; 
 
export default AuthPage; 
