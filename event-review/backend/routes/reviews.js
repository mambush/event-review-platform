const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get reviews for an event
router.get('/event/:eventId', reviewController.getReviewsByEvent);

// Post a review
router.post('/', authMiddleware.authenticate, reviewController.createReview);

// Update a review
router.put('/:id', authMiddleware.authenticate, reviewController.updateReview);

// Delete a review
router.delete('/:id', authMiddleware.authenticate, reviewController.deleteReview);

module.exports = router;
