const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. IMPROVED CORS CONFIGURATION
// This allows your Vercel frontend to communicate with Render
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// 2. UPDATED WILDCARD SYNTAX
// Changed '*' to '(.*)' to fix the "Missing parameter name" PathError
app.options('(.*)', cors()); 

app.use(express.json());

// 3. DATABASE CONNECTION
// Uses the MONGO_URI from your Render Environment Variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// 4. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// 5. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));