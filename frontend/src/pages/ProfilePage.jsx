import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import axios from 'axios';

const ProfilePage = () => {

  const navigate = useNavigate();

  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [userContent, setUserContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: ''
      });
      
      // Carica i contenuti dell'utente
      fetchUserContent();
    }
  }, [user]);

  const fetchUserContent = async () => {
    if (!user) return;
    
    try {
      setContentLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/ugc/user');
      
      if (data.success) {
        setUserContent(data.data);
      }
    } catch (err) {
      console.error('Errore nel caricamento dei contenuti:', err);
    } finally {
      setContentLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validazione
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Le password non corrispondono');
      return;
    }
    
    // Prepara i dati da inviare
    const updateData = {
      name: formData.name,
      bio: formData.bio
    };
    
    // Aggiungi la password solo se è stata inserita
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    // Aggiorna il profilo
    const result = await updateProfile(updateData);
    
    if (result.success) {
      setFormSuccess('Profilo aggiornato con successo');
      // Resetta i campi password
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } else {
      setFormError(result.error || 'Errore durante l\'aggiornamento del profilo');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Effettua l'accesso per visualizzare il tuo profilo</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="page-title">Il tuo profilo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonna sinistra - Informazioni profilo */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="text-center mb-6">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Amministratore
                </span>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">
                {user.bio || 'Nessuna bio disponibile'}
              </p>
            </div>
          </Card>
        </div>
        
        {/* Colonna centrale - Form modifica profilo */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Modifica profilo</h2>
            
            {formError && <Alert type="error" message={formError} className="mb-4" />}
            {formSuccess && <Alert type="success" message={formSuccess} className="mb-4" />}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">L'email non può essere modificata</p>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Racconta qualcosa su di te..."
                ></textarea>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Cambia password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Nuova password
                    </label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Lascia vuoto per non modificare"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Conferma nuova password
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Conferma la nuova password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Salva modifiche
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Sezione contenuti utente */}
      <div>
        <h2 className="text-xl font-semibold mb-4">I tuoi contenuti</h2>
        
        {contentLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Caricamento contenuti...</p>
          </div>
        ) : userContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userContent.map(content => (
              <Card key={content._id} className="overflow-hidden">
                {content.type === 'photo' && content.imageUrl && (
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={content.imageUrl} 
                      alt="Contenuto utente" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        content.type === 'review' ? 'bg-blue-100 text-blue-800' :
                        content.type === 'comment' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {content.type === 'review' ? 'Recensione' : 
                         content.type === 'comment' ? 'Commento' : 'Foto'}
                      </span>
                      
                      {!content.isApproved && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          In attesa di approvazione
                        </span>
                      )}
                    </div>
                    
                    {content.type === 'review' && content.rating && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < content.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {content.spot && (
                    <h3 className="font-semibold mb-2">
                      {content.spot.name}
                    </h3>
                  )}
                  
                  {content.content && (
                    <p className="text-gray-700 text-sm mb-3">
                      {content.content}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 flex justify-between items-center">
                    <span>
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        Modifica
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Non hai ancora creato contenuti</p>
            <p className="mt-2">Esplora gli spot artistici e condividi le tue esperienze!</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/explore')}
            >
              Esplora ora
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
