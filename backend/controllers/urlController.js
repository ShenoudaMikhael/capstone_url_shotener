const Url = require('../models/Url');
const { Op } = require('sequelize');

class UrlController {
  // POST /urls/shorten
  static async shortenUrl(req, res) {
    try {
      const { url, customCode } = req.body;

      // Validate required fields
      if (!url) {
        return res.status(400).json({
          error: 'URL is required',
          code: 'MISSING_URL'
        });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid URL format',
          code: 'INVALID_URL'
        });
      }

      let shortCode;
      let isCustom = false;

      // Handle custom code
      if (customCode) {
        // Validate custom code format
        if (!/^[a-zA-Z0-9]+$/.test(customCode) || customCode.length < 3 || customCode.length > 20) {
          return res.status(400).json({
            error: 'Custom code must be 3-20 characters long and contain only letters and numbers',
            code: 'INVALID_CUSTOM_CODE'
          });
        }

        // Check if custom code is available
        const isAvailable = await Url.isCodeAvailable(customCode);
        if (!isAvailable) {
          return res.status(409).json({
            error: 'Custom code already exists',
            code: 'CODE_EXISTS'
          });
        }

        shortCode = customCode;
        isCustom = true;
      } else {
        // Generate random short code
        let attempts = 0;
        const maxAttempts = 10;

        do {
          shortCode = Url.generateShortCode();
          attempts++;
        } while (!(await Url.isCodeAvailable(shortCode)) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
          return res.status(500).json({
            error: 'Unable to generate unique short code',
            code: 'GENERATION_FAILED'
          });
        }
      }

      // Check if URL already exists (optional - remove if you want multiple short codes for same URL)
      const existingUrl = await Url.findOne({
        where: { originalUrl: url, isActive: true }
      });

      if (existingUrl) {
        return res.json({
          shortCode: existingUrl.shortCode,
          originalUrl: existingUrl.originalUrl,
          shortUrl: existingUrl.getShortUrl(),
          createdAt: existingUrl.createdAt,
          clickCount: existingUrl.clickCount,
          existing: true
        });
      }

      // Create new URL record
      const urlRecord = await Url.create({
        originalUrl: url,
        shortCode,
        customCode: isCustom
      });

      res.status(201).json({
        shortCode: urlRecord.shortCode,
        originalUrl: urlRecord.originalUrl,
        shortUrl: urlRecord.getShortUrl(),
        createdAt: urlRecord.createdAt,
        clickCount: urlRecord.clickCount,
        existing: false
      });

    } catch (error) {
      console.error('Error shortening URL:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /:shortCode - Redirect to original URL
  static async redirectToOriginal(req, res) {
    try {
      const { shortCode } = req.params;

      // Find URL record
      const urlRecord = await Url.findOne({
        where: {
          shortCode,
          isActive: true,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        }
      });

      if (!urlRecord) {
        return res.status(404).json({
          error: 'Short URL not found or expired',
          code: 'URL_NOT_FOUND'
        });
      }

      // Increment click count
      await urlRecord.increment('clickCount');

      // Redirect to original URL
      res.redirect(301, urlRecord.originalUrl);

    } catch (error) {
      console.error('Error redirecting URL:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /urls/stats/:shortCode - Get URL statistics
  static async getUrlStats(req, res) {
    try {
      const { shortCode } = req.params;

      const urlRecord = await Url.findOne({
        where: { shortCode, isActive: true }
      });

      if (!urlRecord) {
        return res.status(404).json({
          error: 'Short URL not found',
          code: 'URL_NOT_FOUND'
        });
      }

      res.json({
        shortCode: urlRecord.shortCode,
        originalUrl: urlRecord.originalUrl,
        shortUrl: urlRecord.getShortUrl(),
        clickCount: urlRecord.clickCount,
        createdAt: urlRecord.createdAt,
        updatedAt: urlRecord.updatedAt,
        isCustom: urlRecord.customCode,
        isActive: urlRecord.isActive,
        expiresAt: urlRecord.expiresAt
      });

    } catch (error) {
      console.error('Error getting URL stats:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  // GET /urls - Get all URLs (for admin/user dashboard)
  static async getAllUrls(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { isActive: true };
      
      if (search) {
        whereClause[Op.or] = [
          { originalUrl: { [Op.like]: `%${search}%` } },
          { shortCode: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Url.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      const urls = rows.map(url => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        shortUrl: url.getShortUrl(),
        clickCount: url.clickCount,
        createdAt: url.createdAt,
        isCustom: url.customCode
      }));

      res.json({
        urls,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Error getting URLs:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = UrlController;