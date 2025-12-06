// /backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
// 1. CORS: Allows requests from your React frontend (running on a different port)
app.use(cors());
// 2. Express JSON Parser: Allows the server to accept and parse JSON data in the body of requests
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

// Basic route to check if the server is running (optional)
app.get('/', (req, res) => {
    res.send('MERN Todo List API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});