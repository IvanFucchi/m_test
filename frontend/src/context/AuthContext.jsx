import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌍 Search-related state (mantenuto dal tuo codice originale)
  const [searchParams, setSearchParams] = useState({
    center: [-74.006, 40.7128],
    zoom: 10
  });

  const handleSearch = ({ center, zoom }) => {
    setSearchParams({ center, zoom });
  };

  // Verifica il token all'avvio dell'app
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Prima controlla se c'è un utente memorizzato localmente (dal tuo codice originale)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        // Poi controlla se c'è un token JWT (per OAuth)
        const token = localStorage.getItem('token');
        
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else if (token) {
          // Configura axios con il token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verifica il token con il backend
          try {
            const { data } = await axios.get('http://localhost:5000/api/auth/verify' );
            
            if (data.success) {
              setUser(data.user);
              setIsAuthenticated(true);
              // Salva anche l'utente in localStorage per compatibilità
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              // Token non valido, rimuovilo
              localStorage.removeItem('token');
              delete axios.defaults.headers.common['Authorization'];
            }
          } catch (error) {
            console.error('Errore nella verifica del token:', error);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Errore nel controllo dell\'autenticazione:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Controlla se c'è un token nell'URL (dopo il reindirizzamento da Google)
    const checkOAuthRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Salva il token nel localStorage
        localStorage.setItem('token', token);
        
        // Rimuovi il token dall'URL per sicurezza
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Imposta il token per le richieste axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      }
      
      return false;
    };
    
    // Prima controlla se c'è un reindirizzamento OAuth
    const hasOAuthToken = checkOAuthRedirect();
    
    // Poi verifica l'autenticazione
    verifyToken();
  }, []);

  // Login con email e password
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password } );
      
      if (data.success) {
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`;
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante il login');
      return false;
    }
  };

  // Login diretto (dal tuo codice originale)
  const loginDirect = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Registrazione utente
  const register = async (name, email, password) => {
    try {
      setError(null);
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password } );
      
      if (data.success) {
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`;
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante la registrazione');
      return false;
    }
  };

  // Login con Google
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Logout
  const logout = ( ) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Aggiorna il profilo utente
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', userData );
      
      if (data.success) {
        // Aggiorna il token se è stato restituito
        if (data.user.token) {
          localStorage.setItem('token', data.user.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`;
        }
        
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        loginDirect, // Mantenuto dal tuo codice originale
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        searchParams, // Mantenuto dal tuo codice originale
        handleSearch // Mantenuto dal tuo codice originale
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
