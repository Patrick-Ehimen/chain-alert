import dotenv from "dotenv";
import {
  addWallet,
  removeWallet,
  listWallets,
} from "../backend/controllers/walletController";
import { getWalletBalance } from "../backend/controllers/get-wallet-balance-controller";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

if (!telegramBotToken) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN is not defined in the environment variables."
  );
}

export const bot = new TelegramBot(telegramBotToken, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text?.toLowerCase() === "hi") {
    bot.sendMessage(chatId, "Hello! How can I help you?");
    console.log("hi");
  }
});

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to Wallet Tracker Bot! Use /help to see available commands."
  );
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
    Available Commands:
    - /addwallet <address> <chain> : Add a wallet to track
    - /removewallet <address> : Remove a wallet from tracking
    - /listwallets : List your tracked wallets
    - /balance <address> : Get the balance of a wallet
    `;
  bot.sendMessage(chatId, helpMessage);
});
