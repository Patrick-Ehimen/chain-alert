import evmService from "../services/evmBalanceService";
import solanaService from "../services/solanaBalanceService";

export interface WalletBalance {
  chainType: "evm" | "solana";
  balance: any;
  chain?: string;
}

export const getWalletBalance = async (
  walletAddress: string,
  chain: string = "ethereum"
): Promise<WalletBalance> => {
  try {
    // Check if the address is EVM (starts with 0x) or Solana
    if (walletAddress.startsWith("0x")) {
      const balance = await evmService.getWalletBalance(
        walletAddress,
        chain as any
      );
      return {
        chainType: "evm",
        chain: balance.chain,
        balance: balance.balance,
      };
    } else {
      const balance = await solanaService.getWalletBalance(walletAddress);
      return {
        chainType: "solana",
        balance: balance.balance,
      };
    }
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
};
