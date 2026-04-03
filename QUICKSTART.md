# ⚡ QUICK START GUIDE

Get the Solana Volume Bot running in **5 minutes**!

---

## 🚀 Installation (1 minute)

```bash
# Navigate to project
cd solana-volume-bot-pro

# Install all dependencies
npm run install:all
```

This installs backend + frontend dependencies (~200 packages).

---

## 🎮 Running the Bot (30 seconds)

### Option 1: Both Servers at Once (Recommended)

```bash
npm run dev
```

This starts:
- ✅ Backend API → http://localhost:5000
- ✅ Frontend Dashboard → http://localhost:3000

### Option 2: Separate Terminals

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

---

## 🎯 First Run Setup (3 minutes)

### 1. Open Dashboard
Go to: **http://localhost:3000**

### 2. Configure Bot
Click **"Configure Bot"**:
- **Network:** Devnet
- **RPC:** `https://api.devnet.solana.com`
- **Token:** `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Min Trade:** 0.01
- **Max Trade:** 0.05
- **Delay Min:** 5000
- **Delay Max:** 15000
- **Slippage:** 10
- Click **Save**

### 3. Add Wallets
Click **"Manage Wallets"**:
- Select **"Generate New Wallets"**
- Enter **3** for count
- Click **"Generate Wallets"**
- **⚠️ IMPORTANT:** Copy all private keys and save them!
- Click **"Done"**

### 4. Fund Wallets
For each wallet address:
1. Copy the public key
2. Go to https://faucet.solana.com/
3. Paste address
4. Request **2 SOL**
5. Wait ~30 seconds
6. Repeat for all wallets

### 5. Start Bot
- Click **"Start Bot"** (green button)
- Watch the magic happen! 🎉

---

## 📊 What You'll See

### Live Stats (Updates every 2 seconds)
- **Total Volume:** Cumulative SOL traded
- **Trades Executed:** Number of buy/sell cycles
- **Volume/Minute:** Last 60 seconds
- **Volume/Hour:** Last 60 minutes

### Activity Logs
- ✓ Green = Success
- ✗ Red = Error
- ⚠ Yellow = Warning
- Real-time trade execution logs

### Wallet Balances
- All wallets with current SOL balance
- Color-coded status (green = good, red = low)

---

## 🛑 Stopping the Bot

Click **"Stop Bot"** (red button) anytime.

---

## ✅ Success Checklist

After starting, you should see:

- [ ] "Bot started" in logs
- [ ] BUY transactions appearing
- [ ] SELL transactions appearing
- [ ] Stats updating (Total Volume increasing)
- [ ] Wallet balances decreasing slightly (fees)
- [ ] No red error messages

---

## 🐛 Quick Troubleshooting

### "No wallets available"
→ Add wallets via "Manage Wallets"

### "Insufficient balance"
→ Fund wallets from Solana faucet

### "Transaction failed"
→ Increase slippage to 15% in config

### Dashboard won't load
→ Check both servers are running

### Backend errors
→ Check you ran `npm run install:all`

---

## 🎓 Next Steps

### Going to Mainnet
1. ⚠️ **TEST ON DEVNET FIRST!**
2. Change network to "Mainnet"
3. Update RPC to mainnet endpoint
4. Use real token address
5. Fund wallets with **real SOL**
6. Start with small amounts

### Optimization
- Add more wallets (5-10 for best results)
- Adjust trade sizes for your volume goals
- Reduce delays for faster trading
- Monitor regularly

---

## 💡 Pro Tips

### For Testing
- Use Devnet (free SOL)
- Start with 2-3 wallets
- Small trade sizes (0.01-0.05)
- Higher slippage (10-15%)

### For Production
- Test thoroughly on Devnet first
- Use 5-10 wallets
- Larger trades (0.1-0.5 SOL)
- Lower slippage (3-5%)
- Monitor 24/7

---

## 🆘 Need Help?

1. **Check README.md** - Full documentation
2. **Check logs panel** - Shows what's happening
3. **Verify configuration** - Common mistakes
4. **Test on Devnet** - Before using real money

---

**That's it! You're ready to generate volume! 🚀**

*Remember: Always test on Devnet first!*
