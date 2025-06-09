import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {

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
    <div className="w-full flex flex-col min-h-screen">
      <Navbar handleSearch={handleSearch} />
      <main className="w-full bg-zinc-950 flex-grow px-6 py-6">
        <Outlet context={{ center, zoom, markers, handleSearch, setMarkers }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
