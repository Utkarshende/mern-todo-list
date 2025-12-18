const express = require('express');
const router = express.Router();

// This should be .post, not .get
router.post('/register', async (req, res) => {
    // ... logic
});

module.exports = router;