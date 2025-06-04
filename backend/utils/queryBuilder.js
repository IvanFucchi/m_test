

import mongoose from 'mongoose';

/**
 * Costruisce una query MongoDB per la ricerca di spot
 * @param {Object} params - Parametri di ricerca
 * @param {Object} user - Utente corrente (per controlli di autorizzazione)
 * @returns {Object} Query MongoDB
 */
export const buildSpotQuery = (params, user = null) => {
  const { 
    search, 
    type, 
    category, 
    mood, 
    musicGenre, 
    lat, 
    lng, 
    distance,
    parentId
  } = params;
  
  // Inizializza l'oggetto query
  let query = {};

  // Filtra per tipo
  if (type) {
    query.type = type;
  }

  // Filtra per categoria
  if (category) {
    query.category = category;
  }

  // Filtra per mood
  if (mood) {
    query.mood = { $in: [mood] };
  }

  // Filtra per genere musicale
  if (musicGenre) {
    query.musicGenres = { $in: [musicGenre] };
  }

  // Filtra per parent (per ottenere i figli di uno spot)
  if (parentId) {
    query.parentId = parentId;
  }

  // Filtra per approvazione (gli admin vedono tutto)
  if (!user || user.role !== 'admin') {
    query.isApproved = true;
  }

  // Ricerca testuale
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Ricerca geografica
  if (lat && lng && distance) {
    try {
      // Assicurati che i valori siano numeri
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const maxDistance = parseFloat(distance) * 1000; // Converti km in metri
      
      // Verifica che i valori siano validi
      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(maxDistance)) {
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        };
      }
    } catch (error) {
      console.error('Errore nella costruzione della query geografica:', error);
    }
  }

  return query;
};

/**
 * Costruisce opzioni di paginazione per le query MongoDB
 * @param {Object} params - Parametri di ricerca
 * @returns {Object} Opzioni di paginazione
 */
export const buildPaginationOptions = (params) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  
  const options = {
    skip: (parseInt(page) - 1) * parseInt(limit),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
  };
  
  return options;
};

/**
 * Calcola la distanza in km tra due punti geografici
 * @param {number} lat1 - Latitudine del primo punto
 * @param {number} lon1 - Longitudine del primo punto
 * @param {number} lat2 - Latitudine del secondo punto
 * @param {number} lon2 - Longitudine del secondo punto
 * @returns {number} Distanza in km
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distanza in km
  return distance;
};

export default {
  buildSpotQuery,
  buildPaginationOptions,
  calculateDistance
};
