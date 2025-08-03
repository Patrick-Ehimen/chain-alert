import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import { WalletModel } from "../../../backend/models/wallet-model";
import walletRoutes from "../../../backend/routes/walletRoutes";

describe("Wallet Routes Integration Tests", () => {
  let mongoServer: MongoMemoryServer;
  let app: express.Application;

  beforeAll(async () => {
    // Setup in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup Express app
    app = express();
    app.use(express.json());
    app.use("/api/wallets", walletRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await WalletModel.deleteMany({});
  });

  describe("POST /api/wallets/add", () => {
    it("should add a new wallet", async () => {
      const walletData = {
        userId: "testUser",
        walletAddress: "0x123456789",
        chainType: "ethereum",
      };

      const response = await request(app)
        .post("/api/wallets/add")
        .send(walletData)
        .expect(201);

      expect(response.body.message).toBe("Wallet added successfully");
      expect(response.body.wallet).toMatchObject(walletData);

      // Verify wallet was saved to database
      const savedWallet = await WalletModel.findOne({
        userId: walletData.userId,
      });
      expect(savedWallet).toMatchObject(walletData);
    });

    it("should return 500 if wallet data is invalid", async () => {
      const invalidWalletData = {
        userId: "testUser",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/wallets/add")
        .send(invalidWalletData)
        .expect(500);

      expect(response.body.message).toBe("Failed to add wallet");
    });
  });

  describe("DELETE /api/wallets/remove", () => {
    it("should remove an existing wallet", async () => {
      // First add a wallet
      const wallet = new WalletModel({
        userId: "testUser",
        walletAddress: "0x123456789",
        chainType: "ethereum",
      });
      await wallet.save();

      const response = await request(app)
        .delete("/api/wallets/remove")
        .send({
          userId: "testUser",
          walletAddress: "0x123456789",
        })
        .expect(200);

      expect(response.body.message).toBe("Wallet removed successfully");

      // Verify wallet was removed from database
      const deletedWallet = await WalletModel.findOne({ userId: "testUser" });
      expect(deletedWallet).toBeNull();
    });
  });

  describe("GET /api/wallets", () => {
    it("should list all wallets for a user", async () => {
      // Add some test wallets
      const testWallets = [
        {
          userId: "testUser",
          walletAddress: "0x123",
          chainType: "ethereum",
        },
        {
          userId: "testUser",
          walletAddress: "0x456",
          chainType: "bitcoin",
        },
      ];

      await WalletModel.insertMany(testWallets);

      const response = await request(app)
        .get("/api/wallets")
        .query({ userId: "testUser" })
        .expect(200);

      expect(response.body.wallets).toHaveLength(2);
      expect(response.body.wallets).toEqual(
        expect.arrayContaining([
          expect.objectContaining(testWallets[0]),
          expect.objectContaining(testWallets[1]),
        ])
      );
    });

    it("should return empty array for user with no wallets", async () => {
      const response = await request(app)
        .get("/api/wallets")
        .query({ userId: "nonexistentUser" })
        .expect(200);

      expect(response.body.wallets).toHaveLength(0);
    });
  });
});
