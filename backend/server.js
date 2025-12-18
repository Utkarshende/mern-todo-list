const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON

// 1. Import Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// 2. Route Middlewares
// This means every route inside authRoutes starts with /api/auth
app.use('/api/auth', authRoutes); 
app.use('/api/todos', todoRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));