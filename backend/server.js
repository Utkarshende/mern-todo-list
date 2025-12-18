const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// 1. GLOBAL MIDDLEWARE
// Enable CORS so your React app (port 3000) can talk to this server (port 5000)
app.use(cors());

// Enable JSON parsing so 'req.body' is not undefined
app.use(express.json());

// 2. ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// 3. ROUTE MOUNTING
// Mounting auth routes at /api/auth
app.use('/api/auth', authRoutes);

// Mounting todo routes at /api/todos
app.use('/api/todos', todoRoutes);

// 4. SANITY CHECK ROUTE
app.get('/', (req, res) => {
    res.send("Server is up and running!");
});

// 5. DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;



mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        // Only start the server if the database connection is successful
        app.listen(PORT, () => {
            console.log(`🚀 Server is sprinting on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });