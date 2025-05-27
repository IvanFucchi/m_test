import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware per proteggere le route che richiedono autenticazione
export const protect = async (req, res, next) => {
  let token;

  // Verifica se il token è presente nell'header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Estrai il token dall'header
      token = req.headers.authorization.split(' ')[1];

      // Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trova l'utente dal token decodificato e rimuovi la password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Utente non trovato');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorizzato, token non valido');
    }
  } else if (!token) {
    res.status(401);
    throw new Error('Non autorizzato, token non presente');
  }
};

// Middleware per verificare se l'utente è admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Non autorizzato, richiesti privilegi di amministratore');
  }
};

// Middleware per verificare se l'utente è il proprietario della risorsa o admin
export const ownerOrAdmin = (resourceModel) => async (req, res, next) => {
  try {
    const resource = await resourceModel.findById(req.params.id);
    
    if (!resource) {
      res.status(404);
      throw new Error('Risorsa non trovata');
    }
    
    // Verifica se l'utente è il proprietario o admin
    if (
      (resource.user && resource.user.toString() === req.user._id.toString()) ||
      (resource.creator && resource.creator.toString() === req.user._id.toString()) ||
      req.user.role === 'admin'
    ) {
      next();
    } else {
      res.status(403);
      throw new Error('Non autorizzato, accesso negato');
    }
  } catch (error) {
    next(error);
  }
};
