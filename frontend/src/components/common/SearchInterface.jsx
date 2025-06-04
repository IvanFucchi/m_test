import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import MapView from './MapView';

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
  const [selectedMapPoint, setSelectedMapPoint] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState([-74.5, 40]);
  const [mapZoom, setMapZoom] = useState(9);
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
          // Centra la mappa sulla posizione dell'utente
          setMapCenter([position.coords.longitude, position.coords.latitude]);
          setMapZoom(12);
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
      setUseCurrentLocation(true);
      setSelectedMapPoint(null);
      
      // Centra la mappa sulla posizione dell'utente
      setMapCenter([userLocation.lng, userLocation.lat]);
      setMapZoom(12);
    }
  };
  
  // Gestisce il click sulla mappa per selezionare un punto
  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    setSelectedMapPoint({ lat, lng });
    setSearchParams(prev => ({
      ...prev,
      lat,
      lng
    }));
    setUseCurrentLocation(false);
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
    setSelectedMapPoint(null);
    setUseCurrentLocation(false);
    setResults([]);
  };

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };
  
  const handleMarkerClick = (marker) => {
    // Gestisce il click su un marker nella mappa
    if (marker._id) {
      navigate(`/spots/${marker._id}`);
    } else {
      // Se il marker non ha un ID (es. risultato OpenAI), mostra i dettagli in altro modo
      console.log('Marker details:', marker);
    }
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
          </div>
          
          {/* Sezione per la posizione */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Posizione</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant={useCurrentLocation ? "primary" : "outline"}
                size="sm"
                onClick={handleUseLocation}
                disabled={!userLocation}
              >
                {useCurrentLocation ? 'Posizione attuale in uso' : 'Usa la mia posizione'}
              </Button>
              
              <div className="text-sm text-gray-600 flex items-center">
                oppure seleziona un punto sulla mappa
              </div>
            </div>
            
            {/* Mappa per selezionare un punto */}
            <div className="h-64 mb-4 border rounded-md overflow-hidden">
              <MapView 
                center={mapCenter}
                zoom={mapZoom}
                markers={[
                  ...(selectedMapPoint ? [{
                    id: 'selected-point',
                    coordinates: [selectedMapPoint.lng, selectedMapPoint.lat],
                    type: 'venue',
                    name: 'Punto selezionato',
                    source: 'selection'
                  }] : []),
                  ...(results || [])
                ]}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
              />
            </div>
            
            {/* Informazioni sulla posizione selezionata */}
            {(selectedMapPoint || useCurrentLocation) && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                    Raggio di ricerca: {searchParams.distance} km
                  </label>
                  
                  <div className="text-sm text-gray-600">
                    {selectedMapPoint && !useCurrentLocation && (
                      <span>Punto selezionato: {selectedMapPoint.lat.toFixed(4)}, {selectedMapPoint.lng.toFixed(4)}</span>
                    )}
                    {useCurrentLocation && userLocation && (
                      <span>Posizione attuale: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                    )}
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
              </div>
            )}
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
                key={spot._id || `${spot.coordinates[0]}-${spot.coordinates[1]}-${spot.name}`} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => spot._id ? handleSpotClick(spot._id) : null}
              >
                <div className="h-48 bg-gray-200 relative">
                  {spot.images && spot.images.length > 0 ? (
                    <img 
                      src={spot.images[0].url || spot.images[0]} 
                      alt={spot.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Nessuna immagine</span>
                    </div>
                  )}
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
                    <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${
                      spot.source === 'openai' ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}>
                      {spot.source === 'openai' ? 'AI' : 'UGC'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                  {spot.city && spot.country && (
                    <p className="text-gray-500 text-sm mb-2">
                      {spot.city}, {spot.country}
                    </p>
                  )}
                  {spot.location && spot.location.city && (
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
                    {spot.musicGenres && spot.musicGenres.slice(0, 2).map((g, i) => (
                      <span key={`musicGenre-${i}`} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;