import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const SearchInterface = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    type: '',
    category: '',
    mood: '',
    musicGenre: '',
    distance: 10,
    lat: null,
    lng: null
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Ottieni la posizione dell'utente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Errore nella geolocalizzazione:', error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUseLocation = () => {
    if (userLocation) {
      setSearchParams(prev => ({
        ...prev,
        lat: userLocation.lat,
        lng: userLocation.lng
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Costruisci i parametri di query
      const queryParams = new URLSearchParams();

      if (searchParams.query) queryParams.append('search', searchParams.query);
      if (searchParams.type) queryParams.append('type', searchParams.type);
      if (searchParams.category) queryParams.append('category', searchParams.category);
      if (searchParams.mood) queryParams.append('mood', searchParams.mood);
      if (searchParams.musicGenre) queryParams.append('musicGenre', searchParams.musicGenre);

      // Aggiungi parametri di posizione se disponibili
      if (searchParams.lat && searchParams.lng) {
        queryParams.append('lat', searchParams.lat);
        queryParams.append('lng', searchParams.lng);
        queryParams.append('distance', searchParams.distance);
      }

      // Esegui la ricerca
      const { data } = await axios.get(`http://localhost:5000/api/spots?${queryParams.toString()}`);

      if (data.success) {
        setResults(data.data);
      } else {
        setError('Errore durante la ricerca');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la ricerca');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      query: '',
      type: '',
      category: '',
      mood: '',
      musicGenre: '',
      distance: 10,
      lat: null,
      lng: null
    });
    setResults([]);
  };

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cerca spot artistici</h2>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                Ricerca testuale
              </label>
              <Input
                type="text"
                id="query"
                name="query"
                value={searchParams.query}
                onChange={handleChange}
                placeholder="Nome, descrizione, tag..."
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={searchParams.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutti i tipi</option>
                <option value="artwork">Opera d'arte</option>
                <option value="venue">Luogo</option>
                <option value="collection">Collezione</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                value={searchParams.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutte le categorie</option>
                <option value="painting">Pittura</option>
                <option value="sculpture">Scultura</option>
                <option value="photography">Fotografia</option>
                <option value="installation">Installazione</option>
                <option value="museum">Museo</option>
                <option value="gallery">Galleria</option>
                <option value="event">Evento</option>
                <option value="other">Altro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
                Mood
              </label>
              <select
                id="mood"
                name="mood"
                value={searchParams.mood}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutti i mood</option>
                <option value="calm">Calmo</option>
                <option value="energetic">Energetico</option>
                <option value="melancholic">Malinconico</option>
                <option value="joyful">Gioioso</option>
                <option value="mysterious">Misterioso</option>
                <option value="romantic">Romantico</option>
              </select>
            </div>

            <div>
              <label htmlFor="musicGenre" className="block text-sm font-medium text-gray-700 mb-1">
                Genere Musicale
              </label>
              <select
                id="musicGenre"
                name="musicGenre"
                value={searchParams.musicGenre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tutti i generi</option>
                <option value="classical">Classica</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="electronic">Elettronica</option>
                <option value="hiphop">Hip Hop</option>
                <option value="folk">Folk</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mb-1">
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                  Distanza (km)
                </label>
                <div className="ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseLocation}
                    disabled={!userLocation}
                  >
                    {searchParams.lat && searchParams.lng ? 'Posizione attiva' : 'Usa la mia posizione'}
                  </Button>
                </div>
              </div>
              <input
                type="range"
                id="distance"
                name="distance"
                min="1"
                max="50"
                value={searchParams.distance}
                onChange={handleChange}
                disabled={!searchParams.lat || !searchParams.lng}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>{searchParams.distance} km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
            >
              Cancella
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Cerca
            </Button>
          </div>
        </form>
      </Card>

      {/* Risultati */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Risultati ({results.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(spot => (
              <Card
                key={spot._id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleSpotClick(spot._id)}
              >
                <div className="h-48 bg-gray-200 relative">
                  {spot.images && spot.images.length > 0 ? (
                    <img
                      src={spot.images[0]}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Nessuna immagine</span>
                    </div>
                  )}
                  {/* Esempio semplificato */}
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {spot.type === 'artwork' ? 'Opera' : spot.type === 'venue' ? 'Luogo' : 'Collezione'}
                    </span>
                    {spot.category && (
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                        {spot.category}
                      </span>
                    )}
                    {/* Badge per la fonte del risultato */}
                    <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${spot.source === 'openai' ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}>
                      {spot.source === 'openai' ? 'AI' : 'UGC'}
                    </span>
                  </div>

                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                  {spot.location && (
                    <p className="text-gray-500 text-sm mb-2">
                      {spot.location.city}, {spot.location.country}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                    {spot.description}
                  </p>

                  {/* Tags, mood, generi musicali */}
                  <div className="flex flex-wrap gap-1">
                    {spot.mood && spot.mood.slice(0, 2).map((m, i) => (
                      <span key={`mood-${i}`} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {m}
                      </span>
                    ))}
                    {spot.musicGenres && spot.musicGenres.slice(0, 2).map((genre, i) => (
                      <span key={`genre-${i}`} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && searchParams.query && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nessun risultato trovato</p>
          <p className="mt-2">Prova a modificare i parametri di ricerca</p>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
