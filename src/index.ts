/**
 * The above TypeScript code initializes services, connects to databases, starts monitoring blockchain
 * activities, and logs application status.
 */
import dotenv from "dotenv";
import { connectMongoDB, connectRedis } from "../config/database";
import { TelegramService } from "./services/TelegramService";
import { BlockchainMonitor } from "./services/BlockchainMonitor";
import winston from "winston";

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

async function startApplication() {
  try {
    // Connect to databases
    await connectMongoDB();
    await connectRedis();

    // Initialize services
    const telegramService = new TelegramService();
    const blockchainMonitor = new BlockchainMonitor(telegramService);

    // Start monitoring
    await blockchainMonitor.startMonitoring();

    logger.info("Application started successfully");
  } catch (error) {
    logger.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApplication();
