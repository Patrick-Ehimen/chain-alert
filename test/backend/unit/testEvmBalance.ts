// import evmService from "../../../backend/services/evmBalanceService";
import evmService from "../../../backend/services/evmBalanceService";

async function testEvmBalance() {
  try {
    // Test wallet address - this is Binance's hot wallet, known to have significant balance
    const testWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

    // Test single chain
    console.log("\nTesting single chain (Optimism):");
    const ethBalance = await evmService.getWalletBalance(
      testWallet,
      "optimism"
    );
    console.log("Optimism balance:", ethBalance);

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
