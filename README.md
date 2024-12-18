# chain-alert

## 🚀 **Project Overview**

**Chain-Alert** is a backend-only application that allows users to monitor wallet addresses on **EVM-compatible blockchains** and **Solana**. The system tracks wallet balances, detects new token purchases, trades, or transactions, and sends real-time notifications via Telegram.

This is ideal for users who need a lightweight and automated way to track on-chain wallet activity.

---

## 📋 **Features**

- **Track Multiple Wallets**: Supports monitoring EVM-compatible wallets (Ethereum, Polygon, Optimism, etc.) and Solana wallets.
- **Real-Time Transaction Alerts**: Detects token transfers, trades, and purchases.
- **Wallet Balance Monitoring**: Periodically fetches wallet balances and checks for changes.
- **Telegram Notifications**: Sends instant alerts to a Telegram bot whenever an event is detected.

---

## 🛠 **Tech Stack**

- **Node.js** - Backend server and logic.
- **Alchemy API** - Real-time EVM blockchain data.
- **Solana Web3.js** - Monitor Solana blockchain wallets.
- **Telegram Bot API** - Sends real-time notifications.
- **MongoDB** - Stores wallet addresses and user configurations.
- **Express.js** - Handles API endpoints and webhook listeners.
- **WebSockets** - Listens to blockchain updates (via Alchemy Webhooks for EVM).

---

## 📦 **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/Patrick-Ehimen/chain-alert.git
cd Chain-Alert
```
