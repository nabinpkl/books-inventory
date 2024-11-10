

const express = require('express')
const router = express.Router()

const pool = require('./db')

const SearchField = {
    ALL: 'all',
    TITLE: 'title',
    AUTHOR: 'author',
    ISBN: 'isbn'
}

router.get('/books', (req, res) => {

    const { searchTerm, searchField, genre, publishedDate } = req.query;
    const conditions = [];
    const values = [];

    if (searchTerm && searchField === SearchField.ALL) {
        conditions.push('(title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1)');
        values.push(`%${searchTerm}%`);
    }
    if (searchTerm && searchField === SearchField.TITLE) {
        conditions.push('title ILIKE $1');
        values.push(`%${searchTerm}%`);
    }
    if (searchTerm && searchField === SearchField.AUTHOR) {
        conditions.push('author ILIKE $1');
        values.push(`%${searchTerm}%`);
    }
    if (searchTerm && searchField === SearchField.ISBN) {
        conditions.push('isbn ILIKE $1');
        values.push(`%${searchTerm}%`);
    }
    if (genre) {
        conditions.push(`genre = $${values.length + 1}`);
        values.push(genre);
    }
    if (publishedDate) {
        conditions.push(`publication_date = $${values.length + 1}`);
        values.push(publishedDate);
    }

    const query = `SELECT * FROM Inventory ${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Error while getting books. Internal server error.' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});


router.post('/books', (req, res) => {
    const { title, author, genre, publication_date, isbn } = req.body;
    pool.query(
        'INSERT INTO Inventory (title, author, genre, publication_date, isbn) ' +
        'VALUES ($1, $2, $3, $4, $5) ' +
        'RETURNING *',
        [title, author, genre, publication_date, isbn],
        (error, result) => {
            if (error) {
                if (error.code === '23505') { // 23505 is the error code for unique violation (duplicate key)
                    // Reset sequence in case of conflict to avoid entry_id gaps
                    pool.query(
                        'SELECT setval(pg_get_serial_sequence(\'Inventory\', \'entry_id\'), (SELECT MAX(entry_id) FROM Inventory));'
                    );
                    res.status(400).json({ error: 'Book with this ISBN already exists.' });
                    return;
                }

                console.error('Error executing query', error);
                res.status(500).json({ error: 'Error while adding book. Internal server error.' });
                return;
            }

            res.status(201).json(result.rows[0]);
        });
});


module.exports = router;