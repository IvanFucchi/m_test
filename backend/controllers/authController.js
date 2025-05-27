import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Registra un nuovo utente
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Utente già registrato');
    }

    // Crea il nuovo utente
    const user = await User.create({
      name,
      email,
      password // La password viene hashata automaticamente nel pre-save hook
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.generateAuthToken()
        }
      });
    } else {
      res.status(400);
      throw new Error('Dati utente non validi');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Autentica utente e genera token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Email o password non validi');
    }

    // Verifica la password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Email o password non validi');
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.generateAuthToken()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ottieni profilo utente
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar
        }
      });
    } else {
      res.status(404);
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Aggiorna profilo utente
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          token: updatedUser.generateAuthToken()
        }
      });
    } else {
      res.status(404);
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verifica token JWT
// @route   GET /api/auth/verify
// @access  Public
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token non fornito'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token non valido o scaduto'
      });
    }
    next(error);
  }
};
