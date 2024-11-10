

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Create an Express app with JSON support
const app = express();
app.use(bodyParser.json());
app.use(cors());


// Import books routes
const routes = require('./routes');
app.use('/api', routes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});