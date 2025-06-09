import MapView from '../components/common/MapView';
import { useOutletContext } from 'react-router-dom';

const ExplorePage = () => {
  const context = useOutletContext();

  return (
    <div className="w-full h-screen flex flex-col">
      {/*
      <header className="p-4 bg-white shadow z-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Esplora gli spot artistici</h1>
      </header>
      */}

      
      <div className="flex-1">
        <MapView
          center={context.center}
          zoom={context.zoom}
          markers={context.markers}
          onMarkerClick={(marker) => alert(`Clicked marker: ${marker.name}`)}
        />
      </div>
    </div>
  );
};

export default ExplorePage; 