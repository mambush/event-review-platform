const app = require('./app');
const db = require('./config/db'); // Import the database connection
const PORT = process.env.PORT || 5000;
require('dotenv').config();


// Test the database connection
db.getConnection()
    .then((connection) => {
        console.log('Successfully connected to the MySQL database!');
        connection.release(); // Release the connection

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the MySQL database:', err);
    });