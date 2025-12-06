// backend/routes/todos.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Import the Todo model

// @route   GET /api/todos
// @desc    Get all Todo items
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all documents in the Todo collection
        // .sort({ timestamp: -1 }) will display the newest tasks first
        const todos = await Todo.find().sort({ timestamp: -1 });

        // Send the found todos as a JSON response
        res.json(todos);
    } catch (err) {
        // If an error occurs (e.g., database connection issue), send a 500 error
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;