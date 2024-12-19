import express from "express";
import request from "supertest";
import balanceRoutes from "../../../backend/routes/wallet-balance-routes";

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(balanceRoutes);

async function testBalanceApi() {
  try {
    console.log("Starting Balance API tests...\n");

    // Test 1: EVM wallet on Ethereum (default chain)
    console.log("Test 1: EVM wallet on Ethereum");
    const evmWallet = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
    const evmResponse = await request(app).get(`/balance/${evmWallet}`);
    console.log("Response:", evmResponse.body, "\n");

    // Test 2: EVM wallet on Optimism
    console.log("Test 2: EVM wallet on Optimism");
    const evmOptimismResponse = await request(app)
      .get(`/balance/${evmWallet}`)
      .query({ chain: "optimism" });
    console.log("Response:", evmOptimismResponse.body, "\n");

    // Test 3: Solana wallet
    console.log("Test 3: Solana wallet");
    const solanaWallet = "72mVYhzqwq5Qq8wnV3eWhwHSejJNQ5HF7ncQHoiSmBE6";
    const solanaResponse = await request(app).get(`/balance/${solanaWallet}`);
    console.log("Response:", solanaResponse.body, "\n");

    // Test 4: Invalid wallet address
    console.log("Test 4: Invalid wallet address");
    const invalidWallet = "0xinvalid";
    const invalidResponse = await request(app).get(`/balance/${invalidWallet}`);
    console.log("Response:", invalidResponse.body, "\n");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the tests
testBalanceApi();
