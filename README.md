# 🚀 Solana Volume Bot - Professional Dashboard

A **fully functional, professional-grade** Solana volume bot with a modern React dashboard. Generate real trading volume on Solana DEXes with an intuitive interface.

![Dashboard](https://img.shields.io/badge/Dashboard-React-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Network](https://img.shields.io/badge/Network-Devnet%20%7C%20Mainnet-purple)

## ✨ Features

### 🎯 Bot Functionality
- ✅ **Real Trading** - Executes actual buy/sell trades on Solana
- ✅ **Multi-Wallet Support** - Import or generate multiple wallets
- ✅ **Smart Execution** - Skips wallets with insufficient balance
- ✅ **Random Parameters** - Randomized trade amounts and delays
- ✅ **Real-time Stats** - Volume per minute, per hour, and total
- ✅ **Comprehensive Logging** - Every trade logged with timestamp

### 🎨 Modern Dashboard
- ✅ **Beautiful UI** - Gradient backgrounds, glassmorphism effects
- ✅ **Real-time Updates** - Live stats refresh every 2 seconds
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Configuration Modal** - Easy bot configuration
- ✅ **Wallet Management** - Generate or import wallets
- ✅ **Live Logs** - Scrollable activity feed

### ⚙️ Configuration
- Network selection (Devnet/Mainnet)
- Custom RPC endpoint
- Token address
- Trade size range
- Delay range
- Slippage tolerance
- Priority fees

---

## 📦 Project Structure

```
solana-volume-bot-pro/
├── backend/
│   ├── server.js          # Express API server
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ConfigModal.js
│   │   │   ├── WalletModal.js
│   │   │   ├── StatsCard.js
│   │   │   ├── WalletsPanel.js
│   │   │   └── LogsPanel.js
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Styles with Tailwind
│   ├── tailwind.config.js
│   └── package.json       # Frontend dependencies
├── package.json           # Root package
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Solana wallet(s)** with SOL (Devnet or Mainnet)

### Installation

```bash
# 1. Clone or download the project
cd solana-volume-bot-pro

# 2. Install all dependencies
npm run install:all

# This installs:
# - Root dependencies (concurrently)
# - Backend dependencies (express, @solana/web3.js, solana-swap)
# - Frontend dependencies (react, tailwind, axios)
```

---

## 🏃 Running the Bot

### Option 1: Development Mode (Both Servers)

```bash
npm run dev
```

This starts:
- Backend API on **http://localhost:5000**
- Frontend Dashboard on **http://localhost:3000**

### Option 2: Separate Servers

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

---

## 🎮 Using the Dashboard

### 1. **Open Dashboard**
Navigate to `http://localhost:3000` in your browser

### 2. **Configure Bot**
Click **"Configure Bot"** button:
- Select **Devnet** for testing (free SOL)
- Or **Mainnet** for production (real SOL)
- Set RPC URL:
  - Devnet: `https://api.devnet.solana.com`
  - Mainnet: `https://api.mainnet-beta.solana.com`
- Enter **Token Address** (SPL token mint)
- Set trade range (min/max SOL per trade)
- Set delay range (milliseconds between cycles)
- Adjust slippage and fees
- Click **"Save Configuration"**

### 3. **Add Wallets**
Click **"Manage Wallets"** button:

**Option A - Generate New Wallets:**
- Click "Generate New Wallets"
- Choose number of wallets (1-10)
- Click "Generate Wallets"
- **IMPORTANT:** Copy and save private keys securely!
- Click "Done"

**Option B - Import Existing Wallets:**
- Click "Import Private Keys"
- Paste private keys (one per line)
- Click "Import Wallets"

### 4. **Fund Wallets**
Send SOL to each wallet address:
- **Devnet:** Get free SOL from [Solana Faucet](https://faucet.solana.com/)
- **Mainnet:** Send real SOL from your wallet

### 5. **Start Bot**
- Click **"Start Bot"** (green button)
- Watch live stats update
- Monitor logs panel for activity
- View wallet balances

### 6. **Stop Bot**
- Click **"Stop Bot"** (red button) anytime

---

## 📊 Dashboard Overview

### Stats Cards
1. **Total Volume** - Cumulative SOL traded
2. **Trades Executed** - Total buy/sell cycles
3. **Volume/Minute** - Recent 60-second volume
4. **Volume/Hour** - Recent 60-minute volume

### Wallets Panel
- Shows all active wallets
- Displays public key and balance
- Color-coded balance status:
  - 🟢 Green: Sufficient balance (≥0.1 SOL)
  - 🔴 Red: Low balance (<0.1 SOL)
- Click refresh to update balances

### Logs Panel
- Real-time activity feed
- Color-coded messages:
  - ✓ Green: Success
  - ✗ Red: Error
  - ⚠ Yellow: Warning
  - ● Gray: Info
- Auto-scrolls to latest
- Shows timestamps

---

## 🌐 Network Configuration

### Devnet (Testing - Recommended First)

```javascript
{
  "network": "devnet",
  "rpc": "https://api.devnet.solana.com",
  "tokenAddress": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  // USDC Devnet token
}
```

**Getting Devnet SOL:**
1. Generate wallets in dashboard
2. Copy public addresses
3. Visit https://faucet.solana.com/
4. Request 2 SOL per wallet
5. Wait ~30 seconds

### Mainnet (Production - Real Money!)

```javascript
{
  "network": "mainnet",
  "rpc": "https://api.mainnet-beta.solana.com",
  "tokenAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  // USDC Mainnet token
}
```

**⚠️ IMPORTANT:**
- Mainnet uses **REAL SOL**
- You will pay **REAL transaction fees**
- **Test on Devnet first!**
- Never risk more than you can afford to lose

---

## 🔧 API Endpoints

The backend exposes these REST endpoints:

### Bot Control
- `POST /api/start` - Start the bot
- `POST /api/stop` - Stop the bot
- `GET /api/status` - Get bot status and stats

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

### Wallets
- `GET /api/wallets` - Get all wallets (with balances)
- `POST /api/wallets` - Add wallets (generate or import)
- `DELETE /api/wallets` - Clear all wallets

### Logs & Stats
- `GET /api/logs` - Get activity logs
- `DELETE /api/logs` - Clear logs
- `POST /api/stats/reset` - Reset statistics

### Health
- `GET /api/health` - Health check

---

## 💡 Tips & Best Practices

### For Testing (Devnet)
```javascript
{
  "minTrade": 0.01,
  "maxTrade": 0.05,
  "delayMin": 5000,
  "delayMax": 15000,
  "slippage": 10
}
```
- Use small amounts
- Higher slippage (less liquidity on Devnet)
- Test with 2-3 wallets first

### For Production (Mainnet)
```javascript
{
  "minTrade": 0.05,
  "maxTrade": 0.2,
  "delayMin": 3000,
  "delayMax": 10000,
  "slippage": 5
}
```
- Larger trade sizes for volume
- Lower slippage (more liquidity)
- Use 5-10 wallets for best results

### Wallet Funding
- **Minimum:** 0.1 SOL per wallet
- **Recommended:** 0.5 SOL per wallet
- **For high volume:** 1-2 SOL per wallet

### Choosing Trade Sizes
- **Small volume:** 0.01-0.05 SOL
- **Medium volume:** 0.05-0.2 SOL
- **High volume:** 0.2-1 SOL

---

## 🛡️ Security

### Best Practices
- ✅ **Never share private keys**
- ✅ **Test on Devnet first**
- ✅ **Use separate wallets for the bot**
- ✅ **Start with small amounts**
- ✅ **Monitor regularly**
- ✅ **Keep Node.js updated**

### Private Key Storage
- Private keys are stored in **memory only**
- Not saved to disk by default
- Generate new wallets if you forget keys
- **Back up generated keys immediately!**

---

## 🐛 Troubleshooting

### Bot Won't Start
- ✅ Check wallets are added
- ✅ Verify wallets have sufficient balance
- ✅ Check configuration is correct
- ✅ Ensure RPC URL is accessible

### Transactions Failing
- ⚙️ Increase slippage (try 10-15%)
- ⚙️ Check token has liquidity
- ⚙️ Verify token address is correct
- ⚙️ Increase priority fee

### Dashboard Not Loading
- 🔌 Check backend is running (port 5000)
- 🔌 Check frontend is running (port 3000)
- 🔌 Clear browser cache
- 🔌 Check console for errors

### Low Volume Generation
- 📊 Add more wallets
- 📊 Increase trade sizes
- 📊 Reduce delays between trades
- 📊 Ensure wallets stay funded

---

## 📝 Example Workflow

### Complete Setup (5 minutes)

```bash
# 1. Install
npm run install:all

# 2. Start servers
npm run dev

# 3. Open browser
# Go to http://localhost:3000

# 4. Configure (in dashboard)
# - Network: Devnet
# - RPC: https://api.devnet.solana.com
# - Token: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
# - Min Trade: 0.01, Max Trade: 0.05
# - Delays: 5000-15000ms

# 5. Generate 3 wallets
# Click "Manage Wallets" → Generate → 3 wallets

# 6. Copy wallet addresses

# 7. Get Devnet SOL
# Visit faucet.solana.com
# Request 2 SOL for each address

# 8. Start bot
# Click "Start Bot"

# 9. Watch it run!
# Monitor stats and logs
```

---

## 💰 Cost Estimates

### Devnet (Free!)
- SOL: Free from faucet
- Transaction fees: Free
- Perfect for testing

### Mainnet (Real Costs)
**Per 100 trades:**
- Trade volume: ~3 SOL (at 0.03 avg)
- Transaction fees: ~0.05 SOL
- Swap API fees: ~0.015 SOL (0.5% of volume)
- **Total cost:** ~0.065 SOL (~$2 at $30/SOL)

**Daily cost (1000 trades):**
- ~0.65 SOL (~$20/day)

---

## 🎓 Technical Details

### How It Works

1. **Bot starts** → Loads configuration
2. **Picks random wallet** → Checks balance
3. **Generates random trade size** → Between min/max
4. **Executes BUY** → Swaps SOL for token
5. **Waits 2-5 seconds** → Random delay
6. **Executes SELL** → Swaps token back to SOL
7. **Updates stats** → Volume tracking
8. **Waits** → Random delay (delayMin-delayMax)
9. **Repeats** → Back to step 2

### Volume Calculation

```javascript
// Per minute: Trades in last 60 seconds
volumePerMinute = sum(trades.last60seconds)

// Per hour: Trades in last 60 minutes
volumePerHour = sum(trades.last60minutes)

// Total: All trades since start
totalVolume = sum(all trades)
```

### Tech Stack
- **Backend:** Node.js, Express, @solana/web3.js, solana-swap
- **Frontend:** React, Tailwind CSS, Axios
- **API:** RESTful design
- **Updates:** 2-second polling

---

## 📜 License

MIT License - Use at your own risk

**Disclaimer:** This software is for educational purposes. Volume trading may violate exchange terms of service. Always comply with local laws and regulations.

---

## 🙏 Support

### Issues?
- Check the troubleshooting section
- Review logs panel in dashboard
- Ensure configuration is correct

### Feature Requests?
- Submit an issue on GitHub
- Describe desired functionality

---

## ✅ Final Checklist

Before running on Mainnet:

- [ ] Tested successfully on Devnet
- [ ] Configuration is correct
- [ ] Wallets are properly funded
- [ ] Token has liquidity on DEXes
- [ ] Ready to monitor actively
- [ ] Understand costs and risks
- [ ] Have backup of private keys

---

**🚀 Happy Trading! (Responsibly)**

*Built with ❤️ for the Solana community*
