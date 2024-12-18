import { Alchemy, Network } from 'alchemy-sdk';
import dotenv from 'dotenv';

dotenv.config();

type SupportedNetwork = 'ethereum' | 'optimism' | 'base' | 'arbitrum' | 'polygon';

interface BalanceResponse {
  chain: string;
  balance: string;
}

const networks: Record<SupportedNetwork, Network> = {
  ethereum: Network.ETH_MAINNET,
  optimism: Network.OPT_MAINNET,
  base: Network.BASE_MAINNET,
  arbitrum: Network.ARB_MAINNET,
  polygon: Network.MATIC_MAINNET
};

class EVMBalanceService {
  private alchemyInstances: Record<SupportedNetwork, Alchemy>;

  constructor() {
    this.alchemyInstances = {} as Record<SupportedNetwork, Alchemy>;
    
    // Initialize Alchemy instances for each network
    for (const [network, networkId] of Object.entries(networks)) {
      this.alchemyInstances[network as SupportedNetwork] = new Alchemy({
        apiKey: process.env.ALCHEMY_API_KEY as string,
        network: networkId,
      });
    }
  }

  /**
   * Get wallet balance for a specific EVM chain
   * @param walletAddress - The wallet address to check
   * @param chain - The chain name (ethereum, optimism, base, arbitrum, polygon)
   * @returns Promise with chain and balance information
   */
  async getWalletBalance(walletAddress: string, chain: SupportedNetwork): Promise<BalanceResponse> {
    try {
      if (!this.alchemyInstances[chain]) {
        throw new Error(`Unsupported chain: ${chain}`);
      }

      const balance = await this.alchemyInstances[chain].core.getBalance(walletAddress);
      
      return {
        chain,
        balance: balance.toString()
      };
    } catch (error) {
      console.error(`Error fetching balance for ${chain}:`, error);
      throw error;
    }
  }

  /**
   * Get wallet balance across all supported chains
   * @param walletAddress - The wallet address to check
   * @returns Promise with array of chain and balance information
   */
  async getAllChainBalances(walletAddress: string): Promise<BalanceResponse[]> {
    try {
      const balancePromises = Object.keys(networks).map(chain => 
        this.getWalletBalance(walletAddress, chain as SupportedNetwork)
      );

      return await Promise.all(balancePromises);
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw error;
    }
  }
}

export default new EVMBalanceService();
