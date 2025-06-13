import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [place, setPlace] = useState('');
  const [activity, setActivity] = useState('');
  const navigate = useNavigate();
  const placeRef = useRef(null);
  const activityRef = useRef(null);

  const isValid = place.trim() !== '' && activity.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;
    if (placeRef.current) placeRef.current.blur();
    if (activityRef.current) activityRef.current.blur();

    const params = new URLSearchParams({ place: place.trim(), activity: activity.trim() });
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
      <div className="flex items-center p-1 border rounded-md w-full">
        <input
          type="text"
          name="place"
          placeholder="Luogo"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          ref={placeRef}
          className="w-full px-2 border-r"
          aria-label="Luogo da cercare"
        />
        <input
          type="text"
          name="activity"
          placeholder="Attività (arte)"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          ref={activityRef}
          className="w-full px-2"
          aria-label="Attività artistica da cercare"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-zinc-950 text-white rounded hover:bg-zinc-700"
        >
          Cerca
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
