import MapView from '../components/common/MapView';
import {useOutletContext} from 'react-router-dom';

const ExplorePage = () => {
  const context = useOutletContext();

  return (
    <section className="w-full h-[calc(100vh-82px)] flex">
      <div className="container mx-auto py-4 flex flex-wrap h-full">


        <div className="flex w-full lg:w-1/2">
          risultati qui
        </div>

        <div className="flex w-full lg:w-1/2 rounded-lg overflow-hidden">
          <MapView
            center={context.center}
            zoom={context.zoom}
            markers={context.markers}
            onMarkerClick={(marker) => alert(`Clicked marker: ${marker.name}`)}
          />
        </div>


      </div>
    </section>
  );
};

export default ExplorePage;
