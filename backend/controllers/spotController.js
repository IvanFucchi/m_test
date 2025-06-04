import Spot from '../models/Spot.js';
import UGContent from '../models/UGContent.js';
import { aiGeneratedSpots } from '../utils/openaiService.js';
import { buildSpotQuery, buildPaginationOptions } from '../utils/queryBuilder.js';

// @desc    Crea un nuovo spot
// @route   POST /api/spots
// @access  Private
export const createSpot = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      coordinates,
      address,
      city,
      country,
      images,
      category,
      mood,
      musicGenres,
      tags,
      dateRange,
      parentId,
      contactInfo
    } = req.body;

    // Verifica che i campi obbligatori siano presenti
    if (!name || !description || !coordinates) {
      res.status(400);
      throw new Error('Inserisci tutti i campi obbligatori');
    }

    // Crea il nuovo spot
    const spot = await Spot.create({
      name,
      description,
      type: type || 'artwork',
      location: {
        type: 'Point',
        coordinates,
        address: address || '',
        city: city || '',
        country: country || ''
      },
      images: images || [],
      category: category || 'other',
      mood: mood || [],
      musicGenres: musicGenres || [],
      tags: tags || [],
      dateRange: dateRange || {},
      parentId: parentId || null,
      contactInfo: contactInfo || {},
      creator: req.user._id,
      isApproved: req.user.role === 'admin', // Auto-approvato se creato da admin
      source: 'database' // Indica che è un contenuto UGC dal database
    });

    // Se lo spot è collegato a un parent, incrementa il contatore dei figli
    if (parentId) {
      await Spot.findByIdAndUpdate(parentId, { $inc: { childrenCount: 1 } });
    }

    res.status(201).json({
      success: true,
      data: spot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ottieni tutti gli spots
// @route   GET /api/spots
// @access  Public
export const getSpots = async (req, res, next) => {
  try {
    const { 
      search, 
      lat, 
      lng, 
      distance,
      page = 1,
      limit = 10,
      source // Parametro per filtrare per fonte (openai, database, all)
    } = req.query;

    // Risultati combinati da restituire
    let combinedResults = [];
    let totalResults = 0;
    
    // Step 1: Ottieni risultati da OpenAI (fonte primaria)
    if (!source || source === 'all' || source === 'openai') {
      try {
        // Prepara le opzioni per OpenAI
        const openAIOptions = {
          lat: lat ? parseFloat(lat) : undefined,
          lng: lng ? parseFloat(lng) : undefined,
          distance: distance ? parseInt(distance) : undefined,
          mood: req.query.mood,
          musicGenre: req.query.musicGenre,
          city: req.query.city
        };
        
        // Genera spot con OpenAI
        let searchQuery = search || '';
        if (!search && (req.query.mood || req.query.musicGenre)) {
          searchQuery = 'luoghi artistici';
          if (req.query.mood) searchQuery += ` con mood ${req.query.mood}`;
          if (req.query.musicGenre) searchQuery += ` legati al genere musicale ${req.query.musicGenre}`;
        }
        
        if (searchQuery) {
          const openaiResults = await aiGeneratedSpots(searchQuery, openAIOptions);
          
          // Aggiungi i risultati di OpenAI all'array combinato
          combinedResults = [...openaiResults];
          totalResults += openaiResults.length;
        }
      } catch (openaiError) {
        console.error('Errore nella ricerca OpenAI:', openaiError);
        // Continua con la ricerca nel database anche se OpenAI fallisce
      }
    }
    
    // Step 2: Ottieni risultati dal database (contenuti UGC)
    if (!source || source === 'all' || source === 'database') {
      // Costruisci la query utilizzando il builder
      const query = buildSpotQuery(req.query, req.user);
      
      // Costruisci opzioni di paginazione
      const options = buildPaginationOptions(req.query);
      
      // Esegui la query
      const dbSpots = await Spot.find(query)
        .populate('creator', 'name avatar')
        .skip(options.skip)
        .limit(options.limit)
        .sort(options.sort);
      
      // Conta il totale dei risultati
      const dbTotal = await Spot.countDocuments(query);
      
      // Assicurati che ogni risultato del database abbia il campo source
      const dbSpotsWithSource = dbSpots.map(spot => {
        const spotObj = spot.toObject();
        if (!spotObj.source) {
          spotObj.source = 'database';
        }
        return spotObj;
      });
      
      // Aggiungi i risultati del database all'array combinato
      combinedResults = [...combinedResults, ...dbSpotsWithSource];
      totalResults += dbTotal;
    }

    // Restituisci i risultati combinati
    res.json({
      success: true,
      count: combinedResults.length,
      total: totalResults,
      pages: Math.ceil(totalResults / parseInt(limit)),
      currentPage: parseInt(page),
      data: combinedResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ottieni uno spot specifico
// @route   GET /api/spots/:id
// @access  Public
export const getSpotById = async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id)
      .populate('creator', 'name avatar')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!spot) {
      res.status(404);
      throw new Error('Spot non trovato');
    }

    // Verifica se lo spot è approvato o se l'utente è admin o il creatore
    if (!spot.isApproved && 
        (!req.user || 
         (req.user.role !== 'admin' && 
          req.user._id.toString() !== spot.creator._id.toString()))) {
      res.status(403);
      throw new Error('Accesso non autorizzato');
    }

    // Se lo spot ha un parent, ottieni le informazioni
    let parent = null;
    if (spot.parentId) {
      parent = await Spot.findById(spot.parentId).select('name type');
    }

    // Se lo spot è un venue o collection, ottieni i figli
    let children = [];
    if (spot.type === 'venue' || spot.type === 'collection') {
      children = await Spot.find({ parentId: spot._id })
        .select('name type category images')
        .limit(5);
    }

    res.json({
      success: true,
      data: {
        ...spot.toObject(),
        parent,
        children
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aggiorna uno spot
// @route   PUT /api/spots/:id
// @access  Private
export const updateSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id);

    if (!spot) {
      res.status(404);
      throw new Error('Spot non trovato');
    }

    // Verifica che l'utente sia il creatore o un admin
    if (spot.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Non autorizzato a modificare questo spot');
    }

    // Aggiorna i campi
    const updatedSpot = await Spot.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        // Gestisci separatamente la location per mantenere il tipo 'Point'
        location: req.body.coordinates ? {
          type: 'Point',
          coordinates: req.body.coordinates,
          address: req.body.address || spot.location.address,
          city: req.body.city || spot.location.city,
          country: req.body.country || spot.location.country
        } : spot.location
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedSpot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Elimina uno spot
// @route   DELETE /api/spots/:id
// @access  Private
export const deleteSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id);

    if (!spot) {
      res.status(404);
      throw new Error('Spot non trovato');
    }

    // Verifica che l'utente sia il creatore o un admin
    if (spot.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Non autorizzato a eliminare questo spot');
    }

    // Se lo spot ha un parent, decrementa il contatore dei figli
    if (spot.parentId) {
      await Spot.findByIdAndUpdate(spot.parentId, { $inc: { childrenCount: -1 } });
    }

    // Elimina lo spot
    await spot.deleteOne();

    // Elimina tutti i contenuti UGC associati
    await UGContent.deleteMany({ spot: req.params.id });

    res.json({
      success: true,
      message: 'Spot eliminato con successo'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approva uno spot (solo admin)
// @route   PUT /api/spots/:id/approve
// @access  Private/Admin
export const approveSpot = async (req, res, next) => {
  try {
    const spot = await Spot.findById(req.params.id);

    if (!spot) {
      res.status(404);
      throw new Error('Spot non trovato');
    }

    spot.isApproved = true;
    await spot.save();

    res.json({
      success: true,
      data: spot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cerca spots vicini a una posizione
// @route   GET /api/spots/nearby
// @access  Public
export const getNearbySpots = async (req, res, next) => {
  try {
    const { lat, lng, distance = 5, limit = 10, source } = req.query;
    
    if (!lat || !lng) {
      res.status(400);
      throw new Error('Latitudine e longitudine sono richieste');
    }
    
    // Risultati combinati da restituire
    let combinedResults = [];
    
    // Step 1: Ottieni risultati da OpenAI (fonte primaria)
    if (!source || source === 'all' || source === 'openai') {
      try {
        // Genera spot con OpenAI
        const openaiResults = await aiGeneratedSpots('luoghi artistici vicini', {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          distance: parseInt(distance),
          mood: req.query.mood,
          musicGenre: req.query.musicGenre,
          city: req.query.city
        });
        
        // Aggiungi i risultati di OpenAI all'array combinato
        combinedResults = [...openaiResults];
      } catch (openaiError) {
        console.error('Errore nella ricerca OpenAI nearby:', openaiError);
        // Continua con la ricerca nel database anche se OpenAI fallisce
      }
    }
    
    // Step 2: Ottieni risultati dal database (contenuti UGC)
    if (!source || source === 'all' || source === 'database') {
      // Costruisci la query utilizzando il builder
      const query = buildSpotQuery({
        ...req.query,
        lat,
        lng,
        distance
      }, req.user);
      
      // Esegui la query
      const dbSpots = await Spot.find(query)
        .limit(parseInt(limit))
        .populate('creator', 'name avatar');
      
      // Assicurati che ogni risultato del database abbia il campo source
      const dbSpotsWithSource = dbSpots.map(spot => {
        const spotObj = spot.toObject();
        if (!spotObj.source) {
          spotObj.source = 'database';
        }
        return spotObj;
      });
      
      // Aggiungi i risultati del database all'array combinato
      combinedResults = [...combinedResults, ...dbSpotsWithSource];
    }
    
    res.json({
      success: true,
      count: combinedResults.length,
      data: combinedResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ottieni spots per mood o genere musicale
// @route   GET /api/spots/discover
// @access  Public
export const discoverSpots = async (req, res, next) => {
  try {
    const { mood, musicGenre, limit = 10, source, lat, lng, distance } = req.query;
    
    if (!mood && !musicGenre) {
      res.status(400);
      throw new Error('Specificare almeno un mood o genere musicale');
    }
    
    // Risultati combinati da restituire
    let combinedResults = [];
    
    // Step 1: Ottieni risultati da OpenAI (fonte primaria)
    if (!source || source === 'all' || source === 'openai') {
      try {
        // Costruisci una query di ricerca basata su mood e/o genere musicale
        let searchQuery = 'luoghi artistici';
        if (mood) searchQuery += ` con mood ${mood}`;
        if (musicGenre) searchQuery += ` legati al genere musicale ${musicGenre}`;
        
        // Genera spot con OpenAI
        const openaiResults = await aiGeneratedSpots(searchQuery, {
          mood,
          musicGenre,
          lat: lat ? parseFloat(lat) : undefined,
          lng: lng ? parseFloat(lng) : undefined,
          distance: distance ? parseInt(distance) : undefined,
          city: req.query.city
        });
        
        // Aggiungi i risultati di OpenAI all'array combinato
        combinedResults = [...openaiResults];
      } catch (openaiError) {
        console.error('Errore nella ricerca OpenAI discover:', openaiError);
        // Continua con la ricerca nel database anche se OpenAI fallisce
      }
    }
    
    // Step 2: Ottieni risultati dal database (contenuti UGC)
    if (!source || source === 'all' || source === 'database') {
      // Costruisci la query utilizzando il builder
      const query = buildSpotQuery(req.query, req.user);
      
      // Esegui la query
      const dbSpots = await Spot.find(query)
        .limit(parseInt(limit))
        .populate('creator', 'name avatar')
        .sort({ rating: -1 });
      
      // Assicurati che ogni risultato del database abbia il campo source
      const dbSpotsWithSource = dbSpots.map(spot => {
        const spotObj = spot.toObject();
        if (!spotObj.source) {
          spotObj.source = 'database';
        }
        return spotObj;
      });
      
      // Aggiungi i risultati del database all'array combinato
      combinedResults = [...combinedResults, ...dbSpotsWithSource];
    }
    
    res.json({
      success: true,
      count: combinedResults.length,
      data: combinedResults
    });
  } catch (error) {
    next(error);
  }
};
