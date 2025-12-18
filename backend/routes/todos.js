const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the guard
const Todo = require('../models/Todo');

// @route   GET /api/todos (PROTECTED)
router.get('/', auth, async (req, res) => {
    try {
        // Find todos belonging ONLY to the logged-in user
        const todos = await Todo.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/todos (PROTECTED)
router.post('/', auth, async (req, res) => {
    try {
        const newTodo = new Todo({
            text: req.body.text,
            user: req.user.id // Save the user ID from the token
        });
        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/todos/:id (PROTECTED)
router.put('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Not found' });
        
        // Ensure user owns the todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/todos/:id (PROTECTED)
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Not found' });

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await todo.deleteOne();
        res.json({ msg: 'Todo removed', todo });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;