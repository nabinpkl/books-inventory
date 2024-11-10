

const { Pool } = require('pg');

// PostgreSQL connection setup
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

// Check if the connection is successful
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
}
);

module.exports = pool;