import solanaService from "../../../backend/services/solanaBalanceService";

async function testSolanaBalance() {
  try {
    // Test wallet address - this is Binance's hot wallet on Solana
    const testWallet = "2yqJEzKxDiixvTXzYr478TCMBNJAhDNLJGSYGAt9YJyq";

    console.log("\nTesting Solana balance for wallet:", testWallet);
    const balance = await solanaService.getWalletBalance(testWallet);
    console.log("Solana balance (SOL):", balance.balance);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testSolanaBalance();
