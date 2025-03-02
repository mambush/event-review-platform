const db = require('../config/db');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.execute('SELECT * FROM events');
        res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    const eventId = req.params.id;

    try {
        const [event] = await db.execute('SELECT * FROM events WHERE id = ?', [eventId]);

        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ event: event[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { title, description, date, time, location, image } = req.body;
    const organizerId = req.userId; // Extracted from JWT token

    try {
        const [result] = await db.execute(
            'INSERT INTO events (title, description, date, time, location, organizer_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, date, time, location, organizerId, image]
        );

        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { title, description, date, time, location, image } = req.body;

    try {
        await db.execute(
            'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ? WHERE id = ?',
            [title, description, date, time, location, image, eventId]
        );

        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        await db.execute('DELETE FROM events WHERE id = ?', [eventId]);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};