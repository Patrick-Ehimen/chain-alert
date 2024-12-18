import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

interface SolanaBalanceResponse {
  balance: number;
}

class SolanaBalanceService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_MAINNET_RPC_URL as string);
  }

  /**
   * Get SOL balance for a wallet address
   * @param walletAddress - The Solana wallet address to check
   * @returns Promise with balance information
   * @throws Error if wallet address is invalid or network error occurs
   */
  async getWalletBalance(walletAddress: string): Promise<SolanaBalanceResponse> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      
      return {
        balance: balance / LAMPORTS_PER_SOL // Convert lamports to SOL
      };
    } catch (error) {
      console.error('Error fetching Solana balance:', error);
      throw error;
    }
  }
}

export default new SolanaBalanceService();
