const express = require('express');
const cors = require('cors');
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { SolanaTracker } = require('solana-swap');
const bs58 = require('bs58');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Bot state
let botState = {
  running: false,
  config: {
    network: 'devnet',
    rpc: 'https://api.devnet.solana.com',
    tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // USDC devnet
    minTrade: 0.01,
    maxTrade: 0.05,
    delayMin: 5000,
    delayMax: 20000,
    slippage: 10,
    priorityFee: 0.0005,
    minSolBalance: 0.1
  },
  wallets: [],
  stats: {
    totalVolume: 0,
    tradesExecuted: 0,
    volumePerMinute: 0,
    volumePerHour: 0,
    startTime: null,
    lastMinuteVolume: [],
    lastHourVolume: []
  },
  logs: [],
  botInterval: null
};

// Helper functions
const addLog = (type, message) => {
  const log = {
    type,
    message,
    timestamp: new Date().toISOString()
  };
  botState.logs.push(log);
  if (botState.logs.length > 100) {
    botState.logs.shift();
  }
  console.log(`[${type.toUpperCase()}] ${message}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

// Check wallet balance
const checkBalance = async (connection, keypair) => {
  try {
    const balance = await connection.getBalance(keypair.publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    addLog('error', `Balance check failed: ${error.message}`);
    return 0;
  }
};

// Execute swap (buy or sell)
const executeSwap = async (connection, keypair, isBuy, amount) => {
  const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';
  const { tokenAddress, slippage, priorityFee } = botState.config;
  
  try {
    const solanaTracker = new SolanaTracker(keypair, botState.config.rpc);
    
    const [fromToken, toToken] = isBuy
      ? [SOL_ADDRESS, tokenAddress]
      : [tokenAddress, SOL_ADDRESS];

    addLog('info', `${isBuy ? 'BUY' : 'SELL'} - Wallet: ${keypair.publicKey.toBase58().slice(0, 8)}... | Amount: ${isBuy ? amount + ' SOL' : 'ALL'}`);

    const swapResponse = await solanaTracker.getSwapInstructions(
      fromToken,
      toToken,
      isBuy ? amount : 'auto',
      slippage,
      keypair.publicKey.toBase58(),
      priorityFee
    );

    const swapOptions = {
      sendOptions: { skipPreflight: true },
      confirmationRetries: 30,
      confirmationRetryTimeout: 1000,
      lastValidBlockHeightBuffer: 150,
      resendInterval: 1000,
      confirmationCheckInterval: 1000,
      commitment: 'processed'
    };

    const txid = await solanaTracker.performSwap(swapResponse, swapOptions);
    
    addLog('success', `${isBuy ? 'BUY' : 'SELL'} completed! TX: ${txid.slice(0, 8)}...`);
    
    return { success: true, txid, amount: isBuy ? amount : 0 };
  } catch (error) {
    addLog('error', `${isBuy ? 'BUY' : 'SELL'} failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Update volume stats
const updateVolumeStats = (tradeAmount) => {
  const now = Date.now();
  botState.stats.totalVolume += tradeAmount;
  botState.stats.tradesExecuted += 1;
  
  // Add to recent trades for per-minute/hour calculation
  botState.stats.lastMinuteVolume.push({ amount: tradeAmount, timestamp: now });
  botState.stats.lastHourVolume.push({ amount: tradeAmount, timestamp: now });
  
  // Clean up old trades (older than 1 minute)
  const oneMinuteAgo = now - 60000;
  botState.stats.lastMinuteVolume = botState.stats.lastMinuteVolume.filter(
    t => t.timestamp > oneMinuteAgo
  );
  
  // Clean up old trades (older than 1 hour)
  const oneHourAgo = now - 3600000;
  botState.stats.lastHourVolume = botState.stats.lastHourVolume.filter(
    t => t.timestamp > oneHourAgo
  );
  
  // Calculate volume per minute/hour
  botState.stats.volumePerMinute = botState.stats.lastMinuteVolume.reduce(
    (sum, t) => sum + t.amount, 0
  );
  botState.stats.volumePerHour = botState.stats.lastHourVolume.reduce(
    (sum, t) => sum + t.amount, 0
  );
};

// Main bot logic
const runBotCycle = async () => {
  if (!botState.running || botState.wallets.length === 0) {
    return;
  }

  const connection = new Connection(botState.config.rpc, 'confirmed');
  
  // Pick random wallet
  const wallet = botState.wallets[Math.floor(Math.random() * botState.wallets.length)];
  const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));

  // Check balance
  const balance = await checkBalance(connection, keypair);
  
  if (balance < botState.config.minSolBalance) {
    addLog('warning', `Wallet ${keypair.publicKey.toBase58().slice(0, 8)}... has insufficient balance: ${balance.toFixed(4)} SOL`);
    return;
  }

  // Generate random trade amount
  const tradeAmount = getRandomNumber(botState.config.minTrade, botState.config.maxTrade);

  // Execute BUY
  const buyResult = await executeSwap(connection, keypair, true, tradeAmount);
  
  if (buyResult.success) {
    // Update stats
    updateVolumeStats(tradeAmount);
    
    // Wait before selling
    await sleep(getRandomNumber(2000, 5000));
    
    // Execute SELL
    await executeSwap(connection, keypair, false, null);
  }

  // Schedule next cycle
  if (botState.running) {
    const delay = getRandomNumber(botState.config.delayMin, botState.config.delayMax);
    setTimeout(runBotCycle, delay);
  }
};

// API Routes

// Get bot status
app.get('/api/status', (req, res) => {
  res.json({
    running: botState.running,
    stats: botState.stats,
    walletCount: botState.wallets.length,
    config: {
      ...botState.config,
      // Don't send private keys
    }
  });
});

// Get configuration
app.get('/api/config', (req, res) => {
  res.json(botState.config);
});

// Update configuration
app.post('/api/config', (req, res) => {
  try {
    botState.config = { ...botState.config, ...req.body };
    addLog('info', 'Configuration updated');
    res.json({ success: true, config: botState.config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get wallets (without private keys)
app.get('/api/wallets', async (req, res) => {
  try {
    const connection = new Connection(botState.config.rpc, 'confirmed');
    
    const walletsWithBalances = await Promise.all(
      botState.wallets.map(async (wallet) => {
        const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
        const balance = await checkBalance(connection, keypair);
        
        return {
          publicKey: keypair.publicKey.toBase58(),
          balance
        };
      })
    );
    
    res.json(walletsWithBalances);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add wallets (import or generate)
app.post('/api/wallets', (req, res) => {
  try {
    const { action, privateKeys, count } = req.body;
    
    if (action === 'import' && privateKeys && Array.isArray(privateKeys)) {
      // Import private keys
      const newWallets = privateKeys.map(pk => ({ privateKey: pk }));
      botState.wallets.push(...newWallets);
      addLog('success', `Imported ${newWallets.length} wallets`);
      res.json({ success: true, count: newWallets.length });
    } else if (action === 'generate' && count) {
      // Generate new wallets
      const newWallets = [];
      for (let i = 0; i < count; i++) {
        const keypair = Keypair.generate();
        newWallets.push({
          privateKey: bs58.encode(keypair.secretKey)
        });
      }
      botState.wallets.push(...newWallets);
      addLog('success', `Generated ${newWallets.length} new wallets`);
      res.json({ 
        success: true, 
        count: newWallets.length,
        wallets: newWallets.map(w => {
          const kp = Keypair.fromSecretKey(bs58.decode(w.privateKey));
          return {
            publicKey: kp.publicKey.toBase58(),
            privateKey: w.privateKey
          };
        })
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid action or parameters' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear wallets
app.delete('/api/wallets', (req, res) => {
  botState.wallets = [];
  addLog('info', 'All wallets cleared');
  res.json({ success: true });
});

// Start bot
app.post('/api/start', (req, res) => {
  if (botState.running) {
    return res.json({ success: false, message: 'Bot is already running' });
  }

  if (botState.wallets.length === 0) {
    return res.status(400).json({ success: false, message: 'No wallets available' });
  }

  botState.running = true;
  botState.stats.startTime = new Date().toISOString();
  addLog('success', 'Bot started');
  
  // Start bot cycle
  runBotCycle();
  
  res.json({ success: true, message: 'Bot started successfully' });
});

// Stop bot
app.post('/api/stop', (req, res) => {
  if (!botState.running) {
    return res.json({ success: false, message: 'Bot is not running' });
  }

  botState.running = false;
  addLog('info', 'Bot stopped');
  
  res.json({ success: true, message: 'Bot stopped successfully' });
});

// Get logs
app.get('/api/logs', (req, res) => {
  res.json(botState.logs);
});

// Clear logs
app.delete('/api/logs', (req, res) => {
  botState.logs = [];
  res.json({ success: true });
});

// Reset stats
app.post('/api/stats/reset', (req, res) => {
  botState.stats = {
    totalVolume: 0,
    tradesExecuted: 0,
    volumePerMinute: 0,
    volumePerHour: 0,
    startTime: null,
    lastMinuteVolume: [],
    lastHourVolume: []
  };
  addLog('info', 'Stats reset');
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solana Volume Bot API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:3000`);
  addLog('info', 'Backend server started');
});
