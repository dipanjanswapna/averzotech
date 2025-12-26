const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

const DEFAULT_EXPIRATION = 3600; // 1 hour

async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error(`Redis get error for key ${key}:`, err);
    return null;
  }
}

async function setCache(key, data, expiration = DEFAULT_EXPIRATION) {
  try {
    await redis.setex(key, expiration, JSON.stringify(data));
  } catch (err) {
    logger.error(`Redis set error for key ${key}:`, err);
  }
}

async function deleteCache(key) {
  try {
    await redis.del(key);
  } catch (err) {
    logger.error(`Redis delete error for key ${key}:`, err);
  }
}

async function clearCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (err) {
    logger.error(`Redis clear error for pattern ${pattern}:`, err);
  }
}

// Cache middleware
function cacheMiddleware(keyPrefix, expiration = DEFAULT_EXPIRATION) {
  return async (req, res, next) => {
    try {
      const key = `${keyPrefix}:${req.originalUrl}`;
      const cachedData = await getCache(key);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method
      res.json = function(data) {
        // Restore original json method
        res.json = originalJson;

        // Cache the data
        setCache(key, data, expiration);

        // Send the response
        return res.json(data);
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  redis,
  getCache,
  setCache,
  deleteCache,
  clearCache,
  cacheMiddleware
};