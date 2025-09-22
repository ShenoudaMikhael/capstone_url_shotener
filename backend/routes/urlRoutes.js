const express = require('express');
const UrlController = require('../controllers/urlController');

const router = express.Router();

// URL shortening routes
router.post('/shorten', UrlController.shortenUrl);
router.get('/stats/:shortCode', UrlController.getUrlStats);
router.get('/', UrlController.getAllUrls);

module.exports = router;