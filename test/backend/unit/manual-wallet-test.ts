import dotenv from "dotenv";
import { connectMongoDB, closeConnections } from "../../../config/database";
import {
  addWallet,
  removeWallet,
  listWallets,
} from "../../../backend/controllers/walletController";
import { WalletModel } from "../../../backend/models/wallet-model";

dotenv.config();

async function testWalletOperations() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log("Connected to MongoDB successfully!");

    // Test 1: Add a wallet
    console.log("\n=== Testing Add Wallet ===");
    const testWallet = {
      userId: "testUser123",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      chain: "EVM" as const,
    };

    const addedWallet = await addWallet(
      testWallet.userId,
      testWallet.address,
      testWallet.chain
    );
    console.log("Added wallet:", addedWallet);
    console.log("Add wallet test:", addedWallet ? "PASSED " : "FAILED ");

    // Test 2: List wallets for user
    console.log("\n=== Testing List Wallets ===");
    const walletsList = await listWallets(testWallet.userId);
    console.log("Found wallets:", walletsList);
    console.log(
      "List wallets test:",
      walletsList.length > 0 ? "PASSED " : "FAILED "
    );

    // Test 3: Remove wallet
    console.log("\n=== Testing Remove Wallet ===");
    const removeResult = await removeWallet(
      testWallet.userId,
      testWallet.address
    );
    console.log("Remove result:", removeResult);
    console.log(
      "Remove wallet test:",
      removeResult.deletedCount === 1 ? "PASSED " : "FAILED "
    );

    // Verify wallet was removed
    console.log("\n=== Verifying Wallet Removal ===");
    const verifyRemoval = await listWallets(testWallet.userId);
    console.log("Wallets after removal:", verifyRemoval);
    console.log(
      "Verify removal test:",
      verifyRemoval.length === 0 ? "PASSED " : "FAILED "
    );

    // Clean up and close connections
    await WalletModel.deleteMany({ userId: "testUser123" });
    console.log("\nTest data cleaned up successfully");

    await closeConnections();
    console.log("Database connections closed successfully");
  } catch (error) {
    console.error("Error during wallet operations test:", error);
    await closeConnections();
    process.exit(1);
  }
}

// Run the tests
console.log("Starting wallet operations tests...");
testWalletOperations().catch(console.error);
