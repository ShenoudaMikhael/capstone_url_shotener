#!/usr/bin/env node

/**
 * Database Sync Script
 * 
 * This script provides different options for syncing your database models:
 * - sync: Normal sync (creates tables if they don't exist)
 * - alter: Alter sync (updates table structure without dropping data)
 * - force: Force sync (drops and recreates all tables - WARNING: loses all data)
 */

require('dotenv').config();
const { testConnection, syncDatabase, forceSyncDatabase, alterSyncDatabase } = require('./models');

const syncType = process.argv[2] || 'sync';

async function runSync() {
  try {
    console.log('🔌 Testing database connection...');
    await testConnection();
    
    console.log(`🗄️  Running ${syncType} operation...`);
    
    switch (syncType) {
      case 'sync':
        await syncDatabase();
        break;
      case 'alter':
        await alterSyncDatabase();
        break;
      case 'force':
        console.log('⚠️  WARNING: This will delete all existing data!');
        console.log('⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await forceSyncDatabase();
        break;
      default:
        console.error('❌ Invalid sync type. Use: sync, alter, or force');
        process.exit(1);
    }
    
    console.log('✅ Database sync completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Sync operation cancelled');
  process.exit(0);
});

runSync();