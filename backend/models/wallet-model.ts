import mongoose, { Schema, Document } from 'mongoose';

// Interface for Token
interface IToken {
  address: string;
  symbol: string;
  balance: string;
  network: string;
}

// Interface for Wallet
export interface IWallet extends Document {
  address: string;
  chain: 'EVM' | 'SOLANA';
  userId: string;
  label?: string;
  tokens: IToken[];
  lastChecked: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Token Schema
const TokenSchema = new Schema<IToken>({
  address: { type: String, required: true },
  symbol: { type: String, required: true },
  balance: { type: String, required: true },
  network: { type: String, required: true }
});

// Wallet Schema
const WalletSchema = new Schema<IWallet>({
  address: { 
    type: String, 
    required: true,
    index: true 
  },
  chain: { 
    type: String, 
    required: true,
    enum: ['EVM', 'SOLANA']
  },
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  label: { 
    type: String,
    default: null
  },
  tokens: [TokenSchema],
  lastChecked: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true,
  versionKey: false
});

// Compound index for unique wallet per chain per user
WalletSchema.index({ address: 1, chain: 1, userId: 1 }, { unique: true });

export const WalletModel = mongoose.model<IWallet>('Wallet', WalletSchema);
