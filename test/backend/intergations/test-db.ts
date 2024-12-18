import dotenv from "dotenv";
import { connectMongoDB, closeConnections } from "../../../config/database";
import { WalletModel } from "../../../backend/models/wallet-model";

dotenv.config();

async function testDatabaseConnection() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log("Connected to MongoDB successfully!");

    // Create a test wallet
    const testWallet = new WalletModel({
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      chain: "EVM",
      userId: "test_user_1",
      label: "Test Wallet",
      tokens: [
        {
          address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          symbol: "USDT",
          balance: "1000.00",
          network: "ethereum",
        },
      ],
    });

    // Save the test wallet
    const savedWallet = await testWallet.save();
    console.log("Test wallet saved successfully:", savedWallet);

    // Query the saved wallet
    const foundWallet = await WalletModel.findOne({
      address: savedWallet.address,
    });
    console.log("Found wallet:", foundWallet);

    // Clean up - delete the test wallet
    await WalletModel.deleteOne({ _id: savedWallet._id });
    console.log("Test wallet deleted successfully");

    // Close database connections
    await closeConnections();
    console.log("Database connections closed successfully");
  } catch (error) {
    console.error("Error during database test:", error);
    await closeConnections();
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
