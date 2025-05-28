import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker } from 'react-map-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaXZhbi1mdWNjaGkiLCJhIjoiY21iNmE1eG5zMDc2NDJtc2Eyd3ZwZWE1NCJ9.VGF2pus_hDZCwcXXg6xlsg';

const MapView = ({
  center = [-74.5, 40],
  zoom = 9,
  markers = [],
  onMarkerClick,
  interactive = true,
  style = { width: '100%', height: '100%' }
}) => {
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  });

  // Aggiorna la vista quando cambiano le props
  useEffect(() => {
    setViewState({
      longitude: center[0],
      latitude: center[1],
      zoom: zoom
    });
  }, []);

  return (
    <Map
      {...viewState}
      onMove={evt => interactive && setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      style={style}
    >
      {markers.map(marker => {
        // Determina il colore del marker in base al tipo e alla fonte
        let backgroundColor;
        let borderColor = 'transparent';
        let borderWidth = '0';

        // Colore base per il tipo di spot
        if (marker.type === 'artwork') {
          backgroundColor = '#3B82F6'; // Blu per opere d'arte
        } else if (marker.type === 'venue') {
          backgroundColor = '#8B5CF6'; // Viola per luoghi
        } else if (marker.type === 'event') {
          backgroundColor = '#EC4899'; // Rosa per eventi
        } else {
          backgroundColor = '#10B981'; // Verde per collezioni o altro
        }

        // Aggiungi bordo distintivo in base alla fonte
        if (marker.source === 'openai') {
          borderColor = '#F59E0B'; // Bordo arancione per risultati OpenAI
          borderWidth = '3px';
        } else if (marker.source === 'database') {
          borderColor = '#06B6D4'; // Bordo azzurro per contenuti UGC
          borderWidth = '3px';
        }



        // console.log(marker.coordinates[0], marker.coordinates[1])



        return (
          <Marker
            key={marker.name}
            longitude={marker.coordinates[0]}
            latitude={marker.coordinates[1]}
            anchor="center"
            onClick={() => {
              console.log('Marker clicked:', marker);
              return onMarkerClick && onMarkerClick(marker)
            }}
            
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor,
                borderRadius: '50%',
                borderColor,
                borderStyle: 'solid',
                borderWidth,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              title={`${marker.title || marker.name} (${marker.source === 'openai' ? 'AI' : 'UGC'})`}
            >
              {marker.type === 'artwork' ? 'A' : marker.type === 'venue' ? 'V' : marker.type === 'event' ? 'E' : 'C'}
            </div>
          </Marker>
        );




        /*
        return (
          <div
            key={marker.name}
            className="marker"
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              transform: `translate(
          ${viewState.longitude === marker.coordinates[0] && viewState.latitude === marker.coordinates[1] ? '-50%, -50%' : '0, 0'}
        )`,
              width: '24px',
              height: '24px',
              backgroundColor,
              borderRadius: '50%',
              borderColor,
              borderStyle: 'solid',
              borderWidth,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={() => onMarkerClick && onMarkerClick(marker)}
            title={`${marker.title || marker.name} (${marker.source === 'openai' ? 'AI' : 'UGC'})`}
          >
            {marker.type === 'artwork' ? 'A' : marker.type === 'venue' ? 'V' : marker.type === 'event' ? 'E' : 'C'}
          </div>
        );
        */





      })}

    </Map>
  );
};

MapView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      // id: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired,
      title: PropTypes.string,
      type: PropTypes.string
    })
  ),
  onMarkerClick: PropTypes.func,
  interactive: PropTypes.bool,
  style: PropTypes.object
};

export default MapView;
