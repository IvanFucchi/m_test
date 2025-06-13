import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';

// Dati dei pin
const pinsData = [
  {
    id: 1,
    title: 'Colosseo',
    description: 'Antico anfiteatro romano nel centro di Roma.',
    imageUrl: 'https://example.com/colosseo.jpg',
    position: { lat: 41.8902, lng: 12.4922 },
  },
  {
    id: 2,
    title: 'Fontana di Trevi',
    description: 'Famosa fontana barocca, una delle attrazioni più popolari di Roma.',
    imageUrl: 'https://example.com/trevi.jpg',
    position: { lat: 41.9009, lng: 12.4833 },
  },
  {
    id: 3,
    title: 'Foro Romano',
    description: 'Complesso di rovine che un tempo era il centro della vita pubblica romana.',
    imageUrl: 'https://example.com/foro.jpg',
    position: { lat: 41.8925, lng: 12.4853 },
  },
];

const mapContainerStyle = { width: '100%', height: '500px' };
const defaultCenter = { lat: 41.8925, lng: 12.4853 };
const GOOGLE_MAPS_API_KEY = 'AIzaSyAKNoAtPNTsO5turiSyUgn2Tuu6Jv1ePjY';

const MapPins = () => {
  const [selectedPin, setSelectedPin] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const onMapLoad = map => {
    // crea un marker nativo per ogni pin
    pinsData.forEach(pin => {
      const marker = new window.google.maps.Marker({
        position: pin.position,
        map,
        title: pin.title,
      });
      // click sul marker apre l’InfoWindow React
      marker.addListener('click', () => setSelectedPin(pin));
      console.log(`Marker nativo creato: ${pin.title}`);
    });
  };

  if (loadError) return <div>Errore caricamento Google Maps</div>;
  if (!isLoaded)  return <div>Caricamento mappa…</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={13}
      onLoad={onMapLoad}
    >
      {selectedPin && (
        <InfoWindow
          position={selectedPin.position}
          onCloseClick={() => setSelectedPin(null)}
        >
          <div style={{ maxWidth: '200px' }}>
            <img
              src={selectedPin.imageUrl}
              alt={selectedPin.title}
              style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
            />
            <h3 style={{ margin: '0 0 4px' }}>{selectedPin.title}</h3>
            <p style={{ margin: 0 }}>{selectedPin.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapPins;
