import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera spot artistici utilizzando OpenAI
 * @param {string} query - Query di ricerca
 * @param {Object} options - Opzioni aggiuntive (lat, lng, distance, mood, musicGenre)
 * @returns {Array} Array di spot generati da AI
 */
export const aiGeneratedSpots = async (query, options = {}) => {
  try {
    console.log('aiGeneratedSpots chiamata con query:', query, 'e opzioni:', options);
    
    // Costruisci il prompt per OpenAI
    const { lat, lng, distance, mood, musicGenre } = options;
    
    let prompt = `Genera 3-5 spot artistici a Roma basati sulla query: "${query}".`;
    
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
      tags (array di tag pertinenti).
      Ogni spot deve avere il campo source impostato a "openai".`;

    console.log('Sending prompt to OpenAI:', prompt);
    
    // Chiamata reale all'API OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Sei un esperto d\'arte e cultura che conosce Roma in dettaglio.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
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
    console.log('Risposta da OpenAI:', response.data);
    
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
    
    return spots;
  } catch (error) {
    console.error('Errore nella generazione di spot con OpenAI:', error);
    return [];
  }
};



export default {
  aiGeneratedSpots
};
