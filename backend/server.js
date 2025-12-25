require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // For production, you can restrict this later
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health Check (Good for Render deployment)
app.get('/', (req, res) => res.send("TaskFlow API is running..."));

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    })
    .catch(err => {
        console.error("❌ DB Connection Error:", err.message);
        process.exit(1); // Stop the server if DB connection fails
    });