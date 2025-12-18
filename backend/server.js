const express = require('express');
const cors = require('cors');
// ... other imports

const app = express();

// 1. MIDDLEWARE (Must be first)
app.use(cors());
app.use(express.json()); // This is required to read the data from your Register form!

// 2. ROUTES
// Make sure you have these EXACT lines
const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes); 

const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

// 3. START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));