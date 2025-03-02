const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define port
const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Event Review Platform API' });
});

// Import and use route files (we'll create these later)
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/events', require('./routes/events.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;