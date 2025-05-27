import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Crea il contesto di autenticazione
const AuthContext = createContext();

// API base URL
const API_URL = 'http://localhost:5000/api';

// Configura axios per gestire automaticamente i token
const setupAxiosInterceptors = (token) => {
  // Interceptor per le richieste
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor per le risposte
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Se l'errore è 401 (non autorizzato) e non è già un retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Qui potremmo implementare un refresh token in futuro
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
};

// Hook personalizzato per utilizzare il contesto di autenticazione
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlla se l'utente è già autenticato al caricamento
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Recupera il token dal localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Configura axios interceptors
        setupAxiosInterceptors(token);
        
        // Verifica il token con il backend
        const { data } = await axios.get(`${API_URL}/auth/verify`);
        
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Se la verifica fallisce, rimuovi il token
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Errore durante la verifica dell\'autenticazione:', err);
        localStorage.removeItem('token');
        setError(err.response?.data?.message || 'Sessione scaduta, effettua nuovamente il login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Funzione di login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (data.success) {
        // Salva il token nel localStorage
        localStorage.setItem('token', data.user.token);
        
        // Configura axios interceptors
        setupAxiosInterceptors(data.user.token);
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Credenziali non valide');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
      return { success: false, error: err.response?.data?.message || 'Errore durante il login' };
    } finally {
      setLoading(false);
    }
  };

  // Funzione di registrazione
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      
      if (data.success) {
        // Salva il token nel localStorage
        localStorage.setItem('token', data.user.token);
        
        // Configura axios interceptors
        setupAxiosInterceptors(data.user.token);
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Errore durante la registrazione');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
      return { success: false, error: err.response?.data?.message || 'Errore durante la registrazione' };
    } finally {
      setLoading(false);
    }
  };

  // Funzione di logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    
    // Reimposta gli interceptors
    setupAxiosInterceptors(null);
    
    // Redirect alla home
    window.location.href = '/';
  };

  // Funzione per aggiornare il profilo
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.put(`${API_URL}/auth/profile`, userData);
      
      if (data.success) {
        setUser(data.user);
        
        // Aggiorna il token se è stato restituito un nuovo token
        if (data.user.token) {
          localStorage.setItem('token', data.user.token);
          setupAxiosInterceptors(data.user.token);
        }
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Errore durante l\'aggiornamento del profilo');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante l\'aggiornamento del profilo');
      return { success: false, error: err.response?.data?.message || 'Errore durante l\'aggiornamento del profilo' };
    } finally {
      setLoading(false);
    }
  };

  // Valore del contesto
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
