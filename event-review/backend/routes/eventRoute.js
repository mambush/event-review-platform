const express = require('express');
const eventsController = require('../controllers/eventsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all events
router.get('/', eventsController.getAllEvents);

// Get a single event by ID
router.get('/:id', eventsController.getEventById);

// Create a new event (admin only)
router.post('/', authMiddleware.authenticate, eventsController.createEvent);

// Update an event (admin only)
router.put('/:id', authMiddleware.authenticate, eventsController.updateEvent);

// Delete an event (admin only)
router.delete('/:id', authMiddleware.authenticate, eventsController.deleteEvent);

module.exports = router;
