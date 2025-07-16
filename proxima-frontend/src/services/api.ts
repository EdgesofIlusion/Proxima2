import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Lieu {
  id: string;
  titre: string;
  description: string;
  type: string;
  ville: string;
  prix_jour: number;
  images: string[];
  latitude: number;
  longitude: number;
}

// Types auth
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data?: { user: User };
  token?: string;
  error?: string;
}

// API Auth
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion'
      };
    }
  }
};

// API Calls
export const lieuxAPI = {
  // Récupérer tous les lieux
  getAll: async (): Promise<Lieu[]> => {
    try {
      const response = await api.get('/api/lieux');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur récupération lieux:', error);
      return [];
    }
  },

  // Test de connexion
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Erreur connexion backend:', error);
      return null;
    }
  }
};