const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// GET /api/todos - Get ONLY the user's todos
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /api/todos - Save todo with User ID
router.post('/', auth, async (req, res) => {
    try {
        const newTodo = new Todo({
            text: req.body.text,
            user: req.user.id
        });
        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE /api/todos/:id - Verify ownership before deleting
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Not found' });

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await todo.deleteOne();
        res.json({ msg: 'Todo removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;