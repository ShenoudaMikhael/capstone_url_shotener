const { sequelize } = require('../config/database');
const { testConnection } = require('../config/database');

// Import all models
const Url = require('./Url');

// Define associations here if needed in the future
// Example: User.hasMany(Url, { foreignKey: 'userId' });
// Example: Url.belongsTo(User, { foreignKey: 'userId' });

// Sync all models with database
const syncDatabase = async (options = {}) => {
  try {
    console.log('Starting database synchronization...');
    
    // Sync all models
    await sequelize.sync(options);
    
    console.log('Database synchronized successfully!');
    console.log('Models synced:', Object.keys(sequelize.models));
    
    return true;
  } catch (error) {
    console.error('Database synchronization failed:', error);
    throw error;
  }
};

// Force sync (drops and recreates tables) - use with caution
const forceSyncDatabase = async () => {
  console.warn('WARNING: Force sync will drop all existing tables and data!');
  return await syncDatabase({ force: true });
};

// Alter sync (updates table structure without dropping data)
const alterSyncDatabase = async () => {
  console.log('Running alter sync (updating table structure)...');
  return await syncDatabase({ alter: true });
};

module.exports = {
  sequelize,
  testConnection,
  Url,
  syncDatabase,
  forceSyncDatabase,
  alterSyncDatabase,
  // Export individual models for easy access
  models: {
    Url
  }
};