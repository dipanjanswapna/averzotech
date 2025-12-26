const mongoose = require('mongoose');
const logger = require('../config/logger');

async function createIndexes() {
  try {
    // User indexes
    await mongoose.model('User').createIndexes();
    logger.info('User indexes created');

    // Product indexes
    await mongoose.model('Product').createIndexes();
    logger.info('Product indexes created');

    // Order indexes
    await mongoose.model('Order').createIndexes();
    logger.info('Order indexes created');

  } catch (error) {
    logger.error('Error creating indexes:', error);
    throw error;
  }
}

module.exports = createIndexes;