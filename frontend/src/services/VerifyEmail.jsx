import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = ( ) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus('error');
          setMessage('Token di verifica mancante');
          return;
        }
        
        console.log('Token di verifica:', token); // Per debug ***

        const { data } = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}` );
        
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verificata con successo!');


          // Reindirizza alla pagina di login dopo 3 secondi
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        
        setStatus('error');
        setMessage(error.response?.data?.message || 'Errore durante la verifica dell\'email');
      }
    };
    
    verifyEmail();
  }, [token, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'verifying' && (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verifica dell'email in corso...
            </h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email verificata con successo!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sarai reindirizzato alla pagina di login tra pochi secondi...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Errore nella verifica dell'email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/login')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Torna alla pagina di login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
