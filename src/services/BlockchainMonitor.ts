import { Alchemy, Network } from "alchemy-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "../models/Wallet";
import { TelegramService } from "./TelegramService";
import { redisClient } from "../../config/database";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/blockchain.log" }),
  ],
});

export class BlockchainMonitor {
  private alchemyClients: Map<string, Alchemy>;
  private solanaConnection: Connection;
  private telegramService: TelegramService;
  private pollingInterval: number;

  constructor(telegramService: TelegramService, pollingInterval = 30000) {
    this.telegramService = telegramService;
    this.pollingInterval = pollingInterval;
    this.alchemyClients = new Map();
    this.setupAlchemyClients();
    this.solanaConnection = new Connection(
      process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
    );
  }

  private setupAlchemyClients() {
    // Setup for different EVM networks
    const networks = [
      { name: "ethereum", network: Network.ETH_MAINNET },
      { name: "polygon", network: Network.MATIC_MAINNET },
      // Add more networks as needed
    ];

    networks.forEach(({ name, network }) => {
      const settings = {
        apiKey: process.env.ALCHEMY_API_KEY,
        network,
      };
      this.alchemyClients.set(name, new Alchemy(settings));
    });
  }

  public async startMonitoring() {
    setInterval(async () => {
      try {
        const wallets = await Wallet.find({});
        for (const wallet of wallets) {
          await this.checkWallet(wallet);
        }
      } catch (error) {
        logger.error("Error in monitoring loop:", error);
      }
    }, this.pollingInterval);
  }

  private async checkWallet(wallet: any) {
    try {
      if (wallet.chain === "EVM") {
        await this.checkEVMWallet(wallet);
      } else if (wallet.chain === "SOLANA") {
        await this.checkSolanaWallet(wallet);
      }
    } catch (error) {
      logger.error(`Error checking wallet ${wallet.address}:`, error);
    }
  }

  private async checkEVMWallet(wallet: any) {
    const alchemy = this.alchemyClients.get(wallet.network);
    if (!alchemy) {
      throw new Error(`No Alchemy client for network: ${wallet.network}`);
    }

    const lastNonce = await redisClient.get(`nonce:${wallet.address}`);
    const currentNonce = await alchemy.core.getTransactionCount(wallet.address);

    if (lastNonce && currentNonce > parseInt(lastNonce)) {
      // New transaction detected
      const transactions = await alchemy.core.getAssetTransfers({
        fromBlock: "latest",
        fromAddress: wallet.address,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
      });

      for (const tx of transactions.transfers) {
        await this.telegramService.sendNotification(
          wallet.userId,
          `New transaction detected for ${wallet.address}:\n` +
            `Type: ${tx.category}\n` +
            `Amount: ${tx.value} ${tx.asset}\n` +
            `To: ${tx.to}`
        );
      }
    }

    await redisClient.set(`nonce:${wallet.address}`, currentNonce.toString());
  }

  private async checkSolanaWallet(wallet: any) {
    const pubkey = new PublicKey(wallet.address);
    const balance = await this.solanaConnection.getBalance(pubkey);
    const lastBalance = await redisClient.get(`balance:${wallet.address}`);

    if (lastBalance && balance !== parseInt(lastBalance)) {
      await this.telegramService.sendNotification(
        wallet.userId,
        `Balance change detected for ${wallet.address}:\n` +
          `New balance: ${balance / 1e9} SOL`
      );
    }

    await redisClient.set(`balance:${wallet.address}`, balance.toString());
  }
}
