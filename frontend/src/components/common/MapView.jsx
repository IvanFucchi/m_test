import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Stile personalizzato per la mappa (opzionale)
const mapStyles = [
  // ... stili della mappa ...
];

const MapView = ({ markers = [], onMarkerClick, initialViewState }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const advancedMarkersRef = useRef({});
  
  // Carica l'API di Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['marker'] // Aggiungi la libreria marker
  });

  // Calcola il centro della mappa in base ai marker o usa un valore predefinito
  const center = initialViewState 
    ? { lat: initialViewState.latitude, lng: initialViewState.longitude }
    : markers.length > 0 
      ? { lat: markers[0].coordinates[1], lng: markers[0].coordinates[0] }
      : { lat: 41.9028, lng: 12.4964 }; // Roma come default

  const onLoad = useCallback(function callback(map) {
    setMapRef(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMapRef(null);
  }, []);

  // Gestisce il click su un marker
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Crea i marker avanzati dopo che la mappa è caricata
  useEffect(() => {
    if (isLoaded && mapRef && window.google && markers.length > 0) {
      // Rimuovi i marker esistenti
      Object.values(advancedMarkersRef.current).forEach(marker => {
        marker.map = null;
      });
      advancedMarkersRef.current = {};

      // Crea nuovi marker avanzati
      markers.forEach(marker => {
        const markerId = marker.id || `${marker.coordinates[0]}-${marker.coordinates[1]}`;
        
        // Determina il colore del marker in base al tipo e alla fonte
        let fillColor;
        let strokeColor = 'white';
        
        // Colore base per il tipo di spot
        if (marker.type === 'artwork') {
          fillColor = '#3B82F6'; // Blu per opere d'arte
        } else if (marker.type === 'venue') {
          fillColor = '#8B5CF6'; // Viola per luoghi
        } else if (marker.type === 'event') {
          fillColor = '#EC4899'; // Rosa per eventi
        } else {
          fillColor = '#10B981'; // Verde per collezioni o altro
        }
        
        // Bordo distintivo in base alla fonte
        if (marker.source === 'openai') {
          strokeColor = '#F59E0B'; // Bordo arancione per risultati OpenAI
        } else if (marker.source === 'database') {
          strokeColor = '#06B6D4'; // Bordo azzurro per contenuti UGC
        }

        // Crea un elemento pin personalizzato
        const pinElement = document.createElement('div');
        pinElement.className = 'custom-marker';
        pinElement.style.width = '20px';
        pinElement.style.height = '20px';
        pinElement.style.borderRadius = '50%';
        pinElement.style.backgroundColor = fillColor;
        pinElement.style.border = `3px solid ${strokeColor}`;
        pinElement.style.cursor = 'pointer';
        pinElement.title = `${marker.title || marker.name} (${marker.source === 'openai' ? 'AI' : 'UGC'})`;

        // Crea il marker avanzato
        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { 
            lat: marker.coordinates[1], 
            lng: marker.coordinates[0] 
          },
          content: pinElement,
          map: mapRef,
          title: `${marker.title || marker.name} (${marker.source === 'openai' ? 'AI' : 'UGC'})`
        });

        // Aggiungi event listener per il click
        advancedMarker.addListener('click', () => {
          handleMarkerClick(marker);
        });

        // Salva il riferimento al marker
        advancedMarkersRef.current[markerId] = advancedMarker;
      });
    }
  }, [isLoaded, mapRef, markers, onMarkerClick]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapStyles,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true
      }}
    >
      {/* I marker avanzati sono gestiti tramite useEffect */}
      
      {selectedMarker && (
        <InfoWindow
          position={{ 
            lat: selectedMarker.coordinates[1], 
            lng: selectedMarker.coordinates[0] 
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>
            <h3 className="font-bold">{selectedMarker.name}</h3>
            <p className="text-sm">{selectedMarker.address}</p>
            <p className="text-xs mt-1">
              <span className={`px-2 py-1 rounded-full text-white ${
                selectedMarker.source === 'openai' ? 'bg-amber-500' : 'bg-cyan-500'
              }`}>
                {selectedMarker.source === 'openai' ? 'AI' : 'UGC'}
              </span>
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <div>Caricamento mappa...</div>;
};

export default MapView;
