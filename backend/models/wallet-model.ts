import mongoose from "mongoose";

export interface IWallet {
  // Wallet address
  address: string;
  // Blockchain type, either EVM or Solana
  chain: "EVM" | "SOLANA";
  // Network name or identifier
  network: string;
  // User ID associated with the wallet
  userId: string;
  // Optional label for the wallet
  label?: string;
  // Last checked date for the wallet
  lastChecked: Date;
  // List of tokens associated with the wallet
  tokens: {
    // Token address
    address: string;
    // Token symbol
    symbol: string;
    // Token balance
    balance: string;
  }[];
}

// Define the schema for the Wallet model using mongoose
const walletSchema = new mongoose.Schema<IWallet>(
  {
    // Wallet address, required field
    address: { type: String, required: true },
    // Blockchain type, either EVM or Solana, required field
    chain: { type: String, required: true, enum: ["EVM", "SOLANA"] },
    // Network name or identifier, required field
    network: { type: String, required: true },
    // User ID associated with the wallet, required field
    userId: { type: String, required: true },
    // Optional label for the wallet
    label: { type: String },
    // Last checked date for the wallet, defaults to current date
    lastChecked: { type: Date, default: Date.now },
    // List of tokens associated with the wallet
    tokens: [
      {
        // Token address, required field
        address: { type: String, required: true },
        // Token symbol, required field
        symbol: { type: String, required: true },
        // Token balance, required field
        balance: { type: String, required: true },
      },
    ],
  },
  // Enable automatic creation of createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create a unique index on the combination of address and chain
walletSchema.index({ address: 1, chain: 1 }, { unique: true });

// Export the Wallet model based on the walletSchema
export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
