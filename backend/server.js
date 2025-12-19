require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
console.log("JWT Secret Loaded:", process.env.JWT_SECRET ? "YES" : "NO");

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server is running on port ${process.env.PORT}`));
    })
    .catch(err => console.error("❌ DB Connection Error:", err));