import mongoose from 'mongoose';
import { createClient } from 'redis';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/database.log' })
  ]
});

// Add console logging if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // MongoDB connection options
    const options = {
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(mongoURI, options);
    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Redis Client Configuration
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff: wait longer between each retry
      const delay = Math.min(1000 * Math.pow(2, retries), 10000);
      logger.info(`Attempting to reconnect to Redis in ${delay}ms...`);
      return delay;
    }
  }
});

// Redis Connection
export const connectRedis = async () => {
  try {
    // Redis event handlers
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis Client Reconnecting...');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');

  } catch (error) {
    logger.error('Redis connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown function
export const closeConnections = async () => {
  try {
    await mongoose.connection.close();
    await redisClient.quit();
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.error('Error closing database connections:', error);
    process.exit(1);
  }
};
