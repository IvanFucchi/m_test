import MapView from '../components/common/MapView';
import MapPins from "@/components/common/MapPins";
import MapPinList from "@/components/common/MapPinList";
import {useOutletContext} from 'react-router-dom';

const ExplorePage = () => {
  const context = useOutletContext();
  const pinsData = [
    {
      id: 1,
      title: 'Colosseo',
      description: 'Antico anfiteatro romano nel centro di Roma.',
      imageUrl: 'https://example.com/colosseo.jpg',
      position: {lat: 41.8902, lng: 12.4922}
    },
    {
      id: 2,
      title: 'Fontana di Trevi',
      description: 'Famosa fontana barocca, una delle attrazioni più popolari di Roma.',
      imageUrl: 'https://example.com/trevi.jpg',
      position: {lat: 41.9009, lng: 12.4833}
    },
    {
      id: 3,
      title: 'Foro Romano',
      description: 'Complesso di rovine che un tempo era il centro della vita pubblica romana.',
      imageUrl: 'https://example.com/foro.jpg',
      position: {lat: 41.8925, lng: 12.4853}
    },
  ];

  return (
    <section className="w-full h-[calc(100vh-82px)] flex">
      <div className="container mx-auto py-4 flex flex-wrap h-full">

        <div className="flex w-full lg:w-1/2">
          <MapPinList pinsData={pinsData}/>
        </div>

        <div className="flex w-full lg:w-1/2 rounded-lg overflow-hidden">
          <MapPins pinsData={pinsData}/>

          {/*
          <MapView
            center={context.center}
            zoom={context.zoom}
            markers={context.markers}
            onMarkerClick={(marker) => alert(`Clicked marker: ${marker.name}`)}
          />
          */}
        </div>

      </div>
    </section>
  );
};

export default ExplorePage;
