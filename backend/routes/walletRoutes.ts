import express from "express";
import {
  addWallet,
  removeWallet,
  listWallets,
} from "../controllers/walletController";

const router = express.Router();

/**
 * @route POST /api/wallets/add
 * @description Add a new wallet to track
 * @access Public
 */
router.post("/add", async (req, res) => {
  try {
    const { userId, walletAddress, chainType } = req.body;
    const wallet = await addWallet(userId, walletAddress, chainType);
    res.status(201).json({ message: "Wallet added successfully", wallet });
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(500).json({ message: "Failed to add wallet", error });
  }
});

/**
 * @route GET /api/wallets/add/:userId/:walletAddress/:chainType
 * @description Add a new wallet to track via URL
 * @access Public
 */
router.get("/add/:userId/:walletAddress/:chainType", async (req, res) => {
  try {
    const { userId, walletAddress, chainType } = req.params;
    const wallet = await addWallet(userId, walletAddress, chainType as 'EVM' | 'SOLANA');
    res.status(201).json({ message: "Wallet added successfully", wallet });
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(500).json({ message: "Failed to add wallet", error });
  }
});

/**
 * @route DELETE /api/wallets/remove
 * @description Remove a wallet from tracking
 * @access Public
 */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;
    const result = await removeWallet(userId, walletAddress);
    res.status(200).json({ message: "Wallet removed successfully", result });
  } catch (error) {
    console.error("Error removing wallet:", error);
    res.status(500).json({ message: "Failed to remove wallet", error });
  }
});

/**
 * @route GET /api/wallets/remove/:userId/:walletAddress
 * @description Remove a wallet from tracking via URL
 * @access Public
 */
router.get("/remove/:userId/:walletAddress", async (req, res) => {
  try {
    const { userId, walletAddress } = req.params;
    const result = await removeWallet(userId, walletAddress);
    res.status(200).json({ message: "Wallet removed successfully", result });
  } catch (error) {
    console.error("Error removing wallet:", error);
    res.status(500).json({ message: "Failed to remove wallet", error });
  }
});

/**
 * @route GET /api/wallets
 * @description List all wallets for a user
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const wallets = await listWallets(userId as string);
    res.status(200).json({ userId, wallets });
  } catch (error) {
    console.error("Error listing wallets:", error);
    res.status(500).json({ message: "Failed to list wallets", error });
  }
});

/**
 * @route GET /api/wallets/list/:userId
 * @description List all wallets for a user via URL
 * @access Public
 */
router.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wallets = await listWallets(userId);
    res.status(200).json({ userId, wallets });
  } catch (error) {
    console.error("Error listing wallets:", error);
    res.status(500).json({ message: "Failed to list wallets", error });
  }
});

export default router;
