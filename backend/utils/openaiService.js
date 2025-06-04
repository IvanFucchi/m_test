import axios from 'axios';
import dotenv from 'dotenv';
import { calculateDistance } from './queryBuilder.js';

// Carica le variabili d'ambiente
dotenv.config();

/**
 * Genera spot artistici utilizzando OpenAI
 * @param {string} query - Query di ricerca
 * @param {Object} options - Opzioni aggiuntive (lat, lng, distance, mood, musicGenre, city)
 * @returns {Array} Array di spot generati da AI
 */
export const aiGeneratedSpots = async (query, options = {}) => {
  try {
    // Costruisci il prompt per OpenAI
    const { lat, lng, distance, mood, musicGenre, city } = options;
    const currentDate = new Date().toISOString().split('T')[0]; // Data corrente in formato YYYY-MM-DD
    
    // Determina la località in base alle coordinate, se fornite
    let locationName = "nella zona specificata";
    if (city) {
      locationName = city;
    }
    
    let prompt = `Genera SOLO luoghi ed eventi artistici REALMENTE ESISTENTI ${locationName} basati sulla query: "${query}".

REGOLE IMPORTANTI:
1. NON INVENTARE luoghi o eventi che non esistono realmente.
2. Per gli eventi, mostre e spettacoli, includi SOLO quelli ATTUALMENTE IN CORSO o FUTURI (dopo il ${currentDate}). NON includere eventi passati o conclusi.
3. Ogni evento deve avere una data di inizio e fine specificata nel formato YYYY-MM-DD.
4. Se non conosci luoghi o eventi che corrispondono esattamente alla query, fornisci solo quelli che conosci con certezza o rispondi con un array vuoto.
5. Ogni risultato DEVE essere un luogo o evento verificabile, con indirizzo reale e coordinate geografiche accurate.`;
    
    if (lat && lng && distance) {
      prompt += ` Gli spot devono essere entro ${distance}km dalle coordinate [${lng}, ${lat}].`;
    }
    
    if (mood) {
      prompt += ` L'atmosfera degli spot dovrebbe essere: ${mood}.`;
    }
    
    if (musicGenre) {
      prompt += ` Gli spot dovrebbero essere associati al genere musicale: ${musicGenre}.`;
    }
    
    prompt += ` Formatta i risultati come un array JSON con i seguenti campi per ogni spot: 
      name (nome dello spot), 
      description (descrizione dettagliata), 
      type (artwork, venue, o event), 
      coordinates (array [longitudine, latitudine]), 
      address (indirizzo completo), 
      city (città), 
      country (paese), 
      category (categoria dell'opera o del luogo), 
      tags (array di tag pertinenti),
      source: "openai"`;
      
    prompt += `, startDate (per eventi, in formato YYYY-MM-DD),
      endDate (per eventi, in formato YYYY-MM-DD).`;

    console.log('Sending prompt to OpenAI:', prompt);
    
    // Chiamata all'API OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: `Sei un assistente specializzato in arte e cultura globale, con conoscenza aggiornata al ${new Date().toLocaleDateString()}.
            
            Fornisci SOLO informazioni su:
            1. Luoghi artistici REALMENTE ESISTENTI con dati verificabili
            2. Eventi, mostre e spettacoli ATTUALMENTE IN CORSO o FUTURI (non eventi passati)
            
            Non inventare mai luoghi o eventi fittizi. Per ogni evento, specifica sempre le date di inizio e fine.
            Se non conosci la risposta o non hai informazioni sufficienti, ammettilo chiaramente e fornisci un array vuoto invece di inventare informazioni.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3  // Temperatura bassa per ridurre la creatività
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Estrai e analizza i risultati
    const content = response.data.choices[0].message.content;
    let spots = [];
    
    try {
      // Estrai l'array JSON dalla risposta
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        spots = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Formato di risposta non valido da OpenAI');
        return [];
      }
    } catch (error) {
      console.error('Errore nel parsing della risposta OpenAI:', error);
      return [];
    }
    
    // Verifica e filtra i risultati
    const verifiedSpots = [];
    const currentDateObj = new Date();
    
    for (const spot of spots) {
      // Verifica se il luogo ha coordinate
      if (spot.coordinates && spot.coordinates.length === 2) {
        // Se abbiamo coordinate di riferimento, verifica che il luogo sia entro la distanza specificata
        if (lat && lng && distance) {
          const distanceInKm = calculateDistance(
            lat, lng, 
            spot.coordinates[1], spot.coordinates[0]
          );
          
          if (distanceInKm > distance) {
            console.log(`Spot scartato perché troppo lontano (${distanceInKm.toFixed(2)}km): ${spot.name}`);
            continue; // Salta questo spot
          }
        }
        
        // Per gli eventi, verifica che non siano già conclusi
        if (spot.type === 'event') {
          if (spot.endDate) {
            const endDate = new Date(spot.endDate);
            if (endDate < currentDateObj) {
              console.log(`Evento scartato perché già concluso: ${spot.name}, terminato il ${spot.endDate}`);
              continue; // Salta questo spot
            }
          } else {
            // Se non c'è una data di fine, aggiungi un flag di avviso
            spot.warning = 'Data di fine non specificata';
          }
        }
        
        // Assicurati che il campo source sia presente
        if (!spot.source) {
          spot.source = 'openai';
        }
        
        // Aggiungi un flag di confidenza
        spot.confidence = 'high';
        
        // Formatta i risultati nel formato richiesto dal modello Spot
        const formattedSpot = {
          name: spot.name,
          description: spot.description,
          type: spot.type || 'artwork',
          coordinates: spot.coordinates,
          address: spot.address || '',
          city: spot.city || '',
          country: spot.country || '',
          category: spot.category || 'other',
          mood: spot.mood || [],
          musicGenres: spot.musicGenres || [],
          tags: spot.tags || [],
          source: 'openai',
          images: spot.images || [
            {
              url: 'https://via.placeholder.com/800x600?text=Immagine+non+disponibile',
              caption: spot.name || 'Immagine'
            }
          ]
        };
        
        // Aggiungi date per eventi
        if (spot.type === 'event') {
          formattedSpot.startDate = spot.startDate;
          formattedSpot.endDate = spot.endDate;
        }
        
        verifiedSpots.push(formattedSpot);
      }
    }
    
    console.log(`Generati ${spots.length} spot, verificati e accettati ${verifiedSpots.length}`);
    return verifiedSpots;
  } catch (error) {
    console.error('Errore nella generazione di spot con OpenAI:', error);
    return [];
  }
};

export default {
  aiGeneratedSpots
};