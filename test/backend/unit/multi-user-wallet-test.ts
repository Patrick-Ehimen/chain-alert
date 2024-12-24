import dotenv from "dotenv";
import { connectMongoDB, closeConnections } from "../../../config/database";
import {
  addWallet,
  removeWallet,
  listWallets,
} from "../../../backend/controllers/walletController";
import { WalletModel } from "../../../backend/models/wallet-model";

dotenv.config();

async function testMultipleUsersWallets() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log("Connected to MongoDB successfully!");

    // Test data for multiple users with different wallets
    const testUsers = [
      {
        userId: "user1",
        wallets: [
          {
            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            chain: "EVM" as const,
          },
          {
            address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            chain: "EVM" as const,
          },
        ],
      },
      {
        userId: "user2",
        wallets: [
          {
            address: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
            chain: "EVM" as const,
          },
          {
            address: "0xb8901acB165ed027E32754E0FFe830802919727f",
            chain: "EVM" as const,
          },
          {
            address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
            chain: "SOLANA" as const,
          },
        ],
      },
      {
        userId: "user3",
        wallets: [
          {
            address: "0x1234567890123456789012345678901234567890",
            chain: "EVM" as const,
          },
          {
            address: "5QBUY4xjJqZCQEVzizP2nPHZD4X9sKxzM2JKzaS7Hpfy",
            chain: "SOLANA" as const,
          },
        ],
      },
    ];

    // Test adding wallets for each user
    console.log("\n=== Testing Adding Multiple Users' Wallets ===");
    for (const user of testUsers) {
      console.log(`\nAdding wallets for user: ${user.userId}`);
      for (const wallet of user.wallets) {
        const addedWallet = await addWallet(
          user.userId,
          wallet.address,
          wallet.chain
        );
        console.log(`Added ${wallet.chain} wallet:`, addedWallet);
      }

      // Verify wallets were added correctly
      const userWallets = await listWallets(user.userId);
      console.log(`Listed wallets for ${user.userId}:`, userWallets);
    }

    // Test listing all wallets for each user
    console.log("\n=== Testing Listing Wallets for Each User ===");
    for (const user of testUsers) {
      const wallets = await listWallets(user.userId);
      console.log(`\nWallets for user ${user.userId}:`, wallets);
    }

    // Test removing wallets
    console.log("\n=== Testing Removing Wallets ===");
    for (const user of testUsers) {
      console.log(`\nRemoving wallets for user: ${user.userId}`);
      for (const wallet of user.wallets) {
        const removed = await removeWallet(user.userId, wallet.address);
        console.log(`Removed ${wallet.chain} wallet:`, removed);
      }

      // Verify wallets were removed
      const remainingWallets = await listWallets(user.userId);
      console.log(`Remaining wallets for ${user.userId}:`, remainingWallets);
    }

    // Clean up
    await WalletModel.deleteMany({});
    console.log("\nTest cleanup completed");
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await closeConnections();
    console.log("\nDatabase connections closed");
  }
}

// Run the tests
console.log("Starting multiple users wallet operations tests...");
testMultipleUsersWallets().catch(console.error);
