const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Url = sequelize.define('Url', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  originalUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  shortCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20],
      isAlphanumeric: true
    }
  },
  customCode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this short code was custom provided by user'
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Optional expiration date for the URL'
  }
}, {
  tableName: 'urls',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      unique: true,
      fields: ['shortCode']
    },
    {
      fields: ['originalUrl']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance method to generate short URL
Url.prototype.getShortUrl = function() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/${this.shortCode}`;
};

// Class method to generate random short code
Url.generateShortCode = function(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Class method to check if short code exists
Url.isCodeAvailable = async function(shortCode) {
  const existing = await this.findOne({ where: { shortCode } });
  return !existing;
};

module.exports = Url;