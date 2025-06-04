import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaXZhbi1mdWNjaGkiLCJhIjoiY21iY2tjaWt4MHJjdzJzc2F1em5scXI5aiJ9.eV_JXLtKNGzFIvsvXBV8FQ';



const LocationSearchMap = ({ onSearch: propSearch }) => {
  const { handleSearch } = useAuth();
  const onSearch = propSearch || handleSearch;

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.length < 3) return setSuggestions([]);

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&types=place`
    );
    const data = await res.json();
    setSuggestions(data.features || []);
  };

  const handlePlaceSelect = (place) => {
    const [lng, lat] = place.center;
    setSuggestions([]);
    setSearchText(place.place_name);
    onSearch({ center: [lng, lat], zoom: 12 });
  };

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      onSearch({ center: [longitude, latitude], zoom: 12 });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="border p-2 rounded w-full sm:w-80"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded shadow max-h-64 overflow-y-auto absolute top-12 left-0 w-full z-20">
            {suggestions.map((place) => (
              <li
                key={place.id}
                onClick={() => handlePlaceSelect(place)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={useMyLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Use My Location
      </button>
    </div>
  );
};

export default LocationSearchMap;
 