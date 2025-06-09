import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../../utils/api';  // Assicurati che il percorso sia corretto

const MainLayout = () => {
  const [center, setCenter] = useState([12.4964, 41.9028]); // Default: Roma
  const [zoom, setZoom] = useState(10);
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Aggiungi stato per la query

  // Gestisce la ricerca testuale
  const handleTextSearch = async (query) => {
    setSearchQuery(query);
    
    try {
      // Chiamata API per ricerca globale
      const response = await api.get(`/api/spots?search=${query}`);
      if (response.data.success) {
        setMarkers(response.data.data);
      }
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      // Fallback con dati simulati in caso di errore
      setMarkers([
        {
          name: 'Risultato simulato per: ' + query,
          coordinates: [12.4964, 41.9028], // Roma
          type: 'artwork',
          source: 'openai'
        }
      ]);
    }
  };

  // Gestisce la ricerca geografica (filtro)
  const handleLocationSearch = ({ center, zoom }) => {
    if (!center || !Array.isArray(center) || center.length !== 2) {
      console.error('Coordinate non valide:', center);
      return;
    }
    
    setCenter(center);
    setZoom(zoom);
    
    // Se c'è già una query testuale, combina con le coordinate
    if (searchQuery) {
      fetchSpotsWithLocation(searchQuery, center);
    } else {
      // Altrimenti, cerca solo per posizione
      fetchMarkersNear(center);
    }
  };

  // Recupera spot con filtro di posizione
  const fetchSpotsWithLocation = async (query, [lng, lat]) => {
    try {
      // Chiamata API con query testuale + coordinate
      const response = await api.get(`/api/spots?search=${query}&lat=${lat}&lng=${lng}&distance=10`);
      if (response.data.success) {
        setMarkers(response.data.data);
      }
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      // Fallback con dati simulati in caso di errore
      setMarkers([
        {
          name: 'Risultato filtrato per: ' + query,
          coordinates: [lng, lat],
          type: 'artwork',
          source: 'openai'
        }
      ]);
    }
  };

  // Recupera spot solo per posizione
  const fetchMarkersNear = async ([lng, lat]) => {
    if (!lng || !lat) return;
    
    try {
      // Chiamata API solo con coordinate
      const response = await api.get(`/api/spots?lat=${lat}&lng=${lng}&distance=10`);
      if (response.data.success) {
        setMarkers(response.data.data);
      }
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      // Fallback con dati simulati in caso di errore
      setMarkers([
        {
          name: 'Spot vicino alla posizione',
          coordinates: [lng + 0.01, lat + 0.01],
          type: 'event',
          source: 'database'
        },
        {
          name: 'Altro spot vicino',
          coordinates: [lng - 0.01, lat - 0.01],
          type: 'artwork',
          source: 'openai'
        }
      ]);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar 
        handleTextSearch={handleTextSearch} 
        handleLocationSearch={handleLocationSearch} 
      />
      <main className="w-full bg-zinc-950 flex-grow px-6 py-6">
        <Outlet context={{ 
          center, 
          zoom, 
          markers, 
          handleTextSearch, 
          handleLocationSearch, 
          searchQuery 
        }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
