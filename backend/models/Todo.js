// backend/models/Todo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a single To-Do item
const TodoSchema = new Schema({
    // The actual text/content of the To-Do item
    text: {
        type: String,
        required: true, // This field must be provided
        trim: true      // Remove whitespace from both ends of the string
    },
    // Status to track if the To-Do is completed
    completed: {
        type: Boolean,
        default: false // New items are not completed by default
    },
    // Timestamp for when the item was created (useful for sorting)
    timestamp: {
        type: Date,
        default: Date.now // Sets the creation date automatically
    }
});

// Create and export the model based on the schema
module.exports = mongoose.model('Todo', TodoSchema);