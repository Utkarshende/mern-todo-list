const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);