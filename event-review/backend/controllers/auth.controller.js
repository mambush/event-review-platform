const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      where: { 
        [sequelize.Op.or]: [{ email }, { username }] 
      } 
    });

    if (userExists) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName
    });

    // Generate token
    const token = generateToken({ id: user.id });

    // Return user data
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ id: user.id });

    // Return user data
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, bio, password } = req.body;
    const user = await User.findByPk(req.user.id);

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (password) user.password = password;

    // Save user
    await user.save();

    // Return updated user
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};