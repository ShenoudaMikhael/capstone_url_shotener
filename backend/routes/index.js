const express = require('express');
const urlRoutes = require('./urlRoutes');
const UrlController = require('../controllers/urlController');

const router = express.Router();

// API routes
router.use('/urls', urlRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'URL Shortener API'
  });
});

// Root redirect route - this handles /:shortCode
router.get('/:shortCode', UrlController.redirectToOriginal);

module.exports = router;