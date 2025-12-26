const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create user instance
        user = new User({ username, email, password });

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save to database
        await user.save();

        // 5. Create and return JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (err) {
        console.error("Internal Register Error:", err.message);
        res.status(500).json({ msg: "Server Error: " + err.message });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Create and return JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { id: user._id, username: user.username, email: user.email } 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;