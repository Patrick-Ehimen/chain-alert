import { Router } from "express";
import { getWalletBalance } from "../controllers/get-wallet-balance-controller";

const router = Router();

/**
 * @route GET /api/balance/:walletAddress
 * @description Get the balance of a specific wallet address
 * @access Public
 */

// Define a route to get the wallet balance
router.get("/balance/:address", async (req, res) => {
  try {
    // Extract the wallet address from the request parameters
    const { address } = req.params;
    // Extract the chain query parameter from the request query
    const { chain } = req.query;
    // Fetch the wallet balance using the getWalletBalance controller function
    const balance = await getWalletBalance(address, chain as string);
    // Send the balance as a JSON response
    res.json(balance);
  } catch (error) {
    // Log any errors that occur and send a 500 status with an error message
    console.error("Balance route error:", error);
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
});

export default router;
