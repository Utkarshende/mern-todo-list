const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. ADVANCED CORS CONFIGURATION
app.use(cors({
    origin: '*', // Allows all origins (good for testing, can restrict to your Vercel URL later)
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// 2. HANDLE PRE-FLIGHT (OPTIONS) REQUESTS
app.options('*', cors());

app.use(express.json());

// 3. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB Connection Error:', err));

// 4. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));