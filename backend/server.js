// /backend/server.js (COMPLETE FILE)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Enable CORS for all routes (to allow connection from React on port 3000)
app.use(cors());
// Built-in middleware to parse incoming JSON requests
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Import Todo Routes
const todoRoutes = require('./routes/todos');

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

// Route Handlers
// Use the Todo Routes for all API endpoints
app.use('/api/todos', todoRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.send('MERN Todo List API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});