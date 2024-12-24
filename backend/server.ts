import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import walletBalanceRoutes from "./routes/wallet-balance-routes";
import walletRoutes from "./routes/walletRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, "../frontend/public")));

// API routes
app.use("/api", walletBalanceRoutes);
app.use("/api/wallets", walletRoutes);

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
