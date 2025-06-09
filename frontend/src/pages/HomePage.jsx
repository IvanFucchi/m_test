import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-zinc-800 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Scopri l'arte in base al tuo mood</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            MUSA ti aiuta a trovare opere d'arte, musei, gallerie ed eventi culturali 
            in base al tuo stato d'animo e ai tuoi gusti musicali.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/explore" className="btn bg-zinc-950 text-amber-600 hover:bg-slate-800 px-8 py-3 rounded-md font-medium">
              Inizia a esplorare
            </Link>
            <Link to="/register" className="btn bg-zinc-950 text-amber-600  hover:bg-slate-800 px-8 py-3 rounded-md font-medium">
              Registrati
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl text-white font-bold text-center mb-12">Come funziona MUSA</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cerca per mood</h3>
            <p className="text-gray-600">
              Seleziona il tuo stato d'animo attuale e scopri opere d'arte e luoghi culturali che risuonano con te.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connessioni musicali</h3>
            <p className="text-gray-600">
              Scopri opere d'arte che si collegano ai tuoi generi musicali preferiti attraverso connessioni culturali uniche.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Esplora la mappa</h3>
            <p className="text-gray-600">
              Visualizza musei, gallerie ed eventi culturali sulla mappa e pianifica il tuo percorso artistico.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl text-white font-bold text-center mb-12">Esplora per categoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Opere d'arte</h3>
            <p className="text-gray-600">Dipinti, sculture e installazioni</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Musei e gallerie</h3>
            <p className="text-gray-600">Luoghi che ospitano collezioni</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Eventi</h3>
            <p className="text-gray-600">Mostre temporanee e performance</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg text-center hover:bg-yellow-100 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Collezioni</h3>
            <p className="text-gray-600">Raccolte tematiche e monografiche</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto a scoprire l'arte in un modo nuovo?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Registrati gratuitamente e inizia a esplorare opere d'arte e luoghi culturali in base al tuo mood e ai tuoi gusti musicali.
        </p>
        <Link to="/register" className="btn bg-zinc-950 text-amber-600  hover:bg-slate-800 px-8 py-3 rounded-md font-medium">
          Crea un account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
