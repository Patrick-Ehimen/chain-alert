// import evmService from "../../../backend/services/evmBalanceService";
import evmService from "../../../backend/services/evmBalanceService";

async function testEvmBalance() {
  try {
    // Test wallet address - this is Binance's hot wallet, known to have significant balance
    const testWallet = "0x5Da73693A062a11589F1b5c68434bf7eAff72366";

    // Test single chain
    console.log("\nTesting single chain (Arbitrum):");
    const ethBalance = await evmService.getWalletBalance(
      testWallet,
      "arbitrum"
    );
    console.log("Arbitrum balance:", ethBalance);

    // Test all chains
    // console.log("\nTesting all chains:");
    // const allBalances = await evmService.getAllChainBalances(testWallet);
    // console.log("All chain balances:", JSON.stringify(allBalances, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testEvmBalance();
