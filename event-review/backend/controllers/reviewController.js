const db = require('../config/db');

// Get reviews for an event
exports.getReviewsByEvent = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const [reviews] = await db.execute('SELECT * FROM reviews WHERE event_id = ?', [eventId]);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Create a review
exports.createReview = async (req, res) => {
    const { eventId, rating, content } = req.body;
    const userId = req.userId; // Extracted from JWT token

    try {
        const [result] = await db.execute(
            'INSERT INTO reviews (user_id, event_id, rating, content) VALUES (?, ?, ?, ?)',
            [userId, eventId, rating, content]
        );

        res.status(201).json({ message: 'Review created successfully', reviewId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating review' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    const reviewId = req.params.id;
    const { rating, content } = req.body;

    try {
        await db.execute(
            'UPDATE reviews SET rating = ?, content = ? WHERE id = ?',
            [rating, content, reviewId]
        );

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating review' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        await db.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting review' });
    }
};