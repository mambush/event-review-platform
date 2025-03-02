const { Event, User, Review } = require('../models');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize');

/**
 * Get all events with filtering
 * @route GET /api/events
 * @access Public
 */
const getEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      location, 
      startDate, 
      endDate, 
      search,
      status = 'published'
    } = req.query;

    // Build filter
    const filter = { status };
    if (category) filter.category = category;
    if (location) {
      const locationTerms = location.split(',');
      if (locationTerms.length === 1) {
        filter[sequelize.Op.or] = [
          { city: { [sequelize.Op.like]: `%${location}%` } },
          { country: { [sequelize.Op.like]: `%${location}%` } }
        ];
      } else {
        filter.city = locationTerms[0].trim();
        filter.country = locationTerms[1].trim();
      }
    }
    
    // Add date filters
    if (startDate) {
      filter.startDate = { [sequelize.Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      filter.endDate = { [sequelize.Op.lte]: new Date(endDate) };
    }
    
    // Add search
    if (search) {
      filter[sequelize.Op.or] = [
        { title: { [sequelize.Op.like]: `%${search}%` } },
        { description: { [sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get events
    const events = await Event.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['startDate', 'ASC']]
    });

    // Return events
    res.status(200).json({
      status: 'success',
      data: {
        events: events.rows,
        pagination: {
          total: events.count,
          page: parseInt(page),
          pages: Math.ceil(events.count / limit)
        }
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
 * Get single event
 * @route GET /api/events/:id
 * @access Public
 */
const getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: Review,
          as: 'reviews',
          where: { isPublished: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName', 'profileImage']
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'Event not found' 
      });
    }

    res.status(200).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

/**
 * Create an event
 * @route POST /api/events
 * @access Private
 */
const createEvent = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    // Add creator ID from authenticated user
    req.body.createdBy = req.user.id;
    
    // Create event
    const event = await Event.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};