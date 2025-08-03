import TelegramBot from 'node-telegram-bot-api';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/telegram.log' })
  ]
});

export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
    }
    this.bot = new TelegramBot(token, { polling: true });
    this.setupCommandHandlers();
  }

  private setupCommandHandlers() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Welcome to Chain Alert! Use /help to see available commands.');
    });

    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
Available commands:
/addwallet <chain> <address> - Add a wallet to monitor
/removewallet <address> - Stop monitoring a wallet
/list - List all monitored wallets
/balance <address> - Get current balance of a wallet
      `;
      this.bot.sendMessage(chatId, helpMessage);
    });
  }

  public async sendNotification(chatId: string, message: string) {
    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      logger.info(`Notification sent to ${chatId}`);
    } catch (error) {
      logger.error('Error sending telegram notification:', error);
      throw error;
    }
  }
}
