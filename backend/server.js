const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. IMPROVED CORS CONFIGURATION
// Setting 'preflightContinue: false' ensures the middleware handles 
// the OPTIONS request so you don't need app.options() at all.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// REMOVED: app.options('(.*)', cors()); <--- This was the line causing the crash.

app.use(express.json());

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// 3. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// 4. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));