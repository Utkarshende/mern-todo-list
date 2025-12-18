const express = require('express');
const router = express.Router();

// Test Route
router.get('/test', (req, res) => res.send("Auth route is found!"));

module.exports = router;