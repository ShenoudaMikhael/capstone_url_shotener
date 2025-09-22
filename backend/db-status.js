#!/usr/bin/env node

/**
 * Database Status Check Script
 * 
 * This script checks the current state of your database and shows:
 * - Connection status
 * - Table structure
 * - Existing data count
 */

require('dotenv').config();
const { sequelize, testConnection, Url } = require('./models');

async function checkDatabaseStatus() {
  try {
    console.log('🔌 Testing database connection...');
    await testConnection();
    
    console.log('\n📊 Database Information:');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    
    console.log('\n🗂️  Table Structure:');
    
    // Get table info
    const [results] = await sequelize.query(`
      SELECT 
        COLUMN_NAME as 'Field',
        DATA_TYPE as 'Type',
        IS_NULLABLE as 'Null',
        COLUMN_KEY as 'Key',
        COLUMN_DEFAULT as 'Default',
        EXTRA as 'Extra'
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
      AND TABLE_NAME = 'urls'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.table(results);
    
    console.log('\n🔍 Indexes:');
    const [indexes] = await sequelize.query(`
      SELECT 
        INDEX_NAME as 'Index Name',
        COLUMN_NAME as 'Column',
        NON_UNIQUE as 'Non Unique',
        INDEX_TYPE as 'Type'
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
      AND TABLE_NAME = 'urls'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `);
    
    console.table(indexes);
    
    console.log('\n📈 Data Statistics:');
    const urlCount = await Url.count();
    const activeUrlCount = await Url.count({ where: { isActive: true } });
    const totalClicks = await Url.sum('clickCount') || 0;
    
    console.log(`Total URLs: ${urlCount}`);
    console.log(`Active URLs: ${activeUrlCount}`);
    console.log(`Total Clicks: ${totalClicks}`);
    
    if (urlCount > 0) {
      console.log('\n🔗 Recent URLs:');
      const recentUrls = await Url.findAll({
        attributes: ['shortCode', 'originalUrl', 'clickCount', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
      
      console.table(recentUrls.map(url => ({
        'Short Code': url.shortCode,
        'Original URL': url.originalUrl.substring(0, 50) + (url.originalUrl.length > 50 ? '...' : ''),
        'Clicks': url.clickCount,
        'Created': url.createdAt.toISOString().split('T')[0]
      })));
    }
    
    console.log('\n✅ Database status check completed successfully!');
    
  } catch (error) {
    console.error('❌ Database status check failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseStatus();