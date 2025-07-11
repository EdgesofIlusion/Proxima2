import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  nom: string;
  email: string;
  type: 'USER' | 'PROPRIO' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nom: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // TODO: Valider le token avec l'API
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, mot_de_passe: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email, mot_de_passe
      });
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (nom: string, email: string, mot_de_passe: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nom, email, mot_de_passe
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
