const mongoose = require('mongoose');

// Define the structure of a User in our database
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevents two users from using the same email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Automatically sets the signup date
    }
});

// Create and export the model
module.exports = mongoose.model('User', UserSchema);