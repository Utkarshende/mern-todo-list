// backend/routes/todos.js (COMPLETE FILE)

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// @route   GET /api/todos
// @desc    Get all Todo items
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all documents and sort by newest first (descending timestamp)
        const todos = await Todo.find().sort({ timestamp: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/todos
// @desc    Create a new Todo item
// @access  Public
router.post('/', async (req, res) => {
    const { text } = req.body;

    // Basic validation
    if (!text) {
        return res.status(400).json({ msg: 'Please enter a todo text' });
    }

    try {
        const newTodo = new Todo({
            text: text
        });

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/todos/:id
// @desc    Toggle the completed status of a Todo item
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        // 1. Find the todo item by ID
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }

        // 2. Toggle the 'completed' status
        todo.completed = !todo.completed;

        // 3. Save the updated todo item back to the database
        await todo.save();

        // 4. Respond with the updated todo object
        res.json(todo);
    } catch (err) {
        // This catch block will usually handle invalid ID format errors
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;