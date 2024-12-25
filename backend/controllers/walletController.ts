import { WalletModel } from "../models/wallet-model";

/**
 * Adds a new wallet to the database.
 * @param userId - The ID of the user.
 * @param address - The address of the wallet.
 * @param chain - The blockchain type ('EVM' or 'SOLANA').
 * @returns The newly created wallet document.
 */
export const addWallet = async (
  userId: string,
  address: string,
  chain: "EVM" | "SOLANA"
) => {
  const newWallet = new WalletModel({
    userId,
    address,
    chain,
    tokens: [], // Initialize with empty tokens array
  });
  return await newWallet.save();
};

/**
 * Removes a wallet from the database.
 * @param userId - The ID of the user.
 * @param address - The address of the wallet.
 * @returns The result of the delete operation.
 */
export const removeWallet = async (userId: string, address: string) => {
  return await WalletModel.deleteOne({ userId, address });
};

/**
 * Lists all wallets for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of wallet documents for the user.
 */
export const listWallets = async (userId: string) => {
  return await WalletModel.find({ userId });
};
