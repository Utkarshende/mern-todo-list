const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Must be bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
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

module.exports = router;