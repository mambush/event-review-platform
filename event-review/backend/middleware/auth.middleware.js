const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Not authorized, no token provided' 
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'User not found' 
      });
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'Not authorized, token failed' 
    });
  }
};

/**
 * Middleware to restrict routes to admin users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ 
      status: 'fail',
      message: 'Not authorized as admin' 
    });
  }
};

module.exports = {
  protect,
  admin
};