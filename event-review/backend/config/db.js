const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'Nyandana@23!', // replace with your MySQL password
    database: 'event_review_platform' // replace with your database name
});

module.exports = pool.promise();
