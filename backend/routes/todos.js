const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// GET TODOS
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST TODO
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

// DELETE TODO
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Ensure user owns the todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        await todo.deleteOne();
        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;