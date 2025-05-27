import React from 'react';
import SearchInterface from '../components/common/SearchInterface';

const ExplorePage = () => {
  return (
    <div>
      <h1 className="page-title">Esplora gli spot artistici</h1>
      <p className="text-gray-600 mb-6">
        Cerca opere d'arte, musei, gallerie ed eventi culturali in base al tuo mood, ai tuoi gusti musicali o alla tua posizione.
      </p>
      
      <SearchInterface />
    </div>
  );
};

export default ExplorePage;
