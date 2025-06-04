import React, { useState } from 'react';
import MapView from '../components/common/MapView';
import LocationSearchMap from '../components/common/LocationSearchMap';

const ExplorePage = () => {
  const [center, setCenter] = useState([-74.006, 40.7128]);
  const [zoom, setZoom] = useState(10);
  const [markers, setMarkers] = useState([]);

  const handleSearch = ({ center, zoom }) => {
    setCenter(center);
    setZoom(zoom);
    fetchMarkersNear(center);
  };

  const fetchMarkersNear = ([lng, lat]) => {
    // Placeholder: replace with actual API call
    setMarkers([
      {
        name: 'Simulated Spot',
        coordinates: [lng + 0.01, lat + 0.01],
        type: 'event',
        source: 'database'
      },
      {
        name: 'Another Spot',
        coordinates: [lng - 0.01, lat - 0.01],
        type: 'artwork',
        source: 'openai'
      }
    ]);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="p-4 bg-white shadow z-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Esplora gli spot artistici</h1>
        <LocationSearchMap onSearch={handleSearch} />
      </header>

      <div className="flex-1">
        <MapView
          center={center}
          zoom={zoom}
          markers={markers}
          onMarkerClick={(marker) => alert(`Clicked marker: ${marker.name}`)}
        />
      </div>
    </div>
  );
};

export default ExplorePage;