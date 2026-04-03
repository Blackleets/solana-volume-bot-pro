const express = require('express');
const cors = require('cors');
const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { SolanaTracker } = require('solana-swap');
const bs58 = require('bs58');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Bot state (enhanced for dual mode)
let botState = {
  // General
  mode: 'volume', // 'volume' or 'sniper'
  running: false,
  
  // Configuration
  config: {
    // Network
    network: 'devnet',
    rpc: 'https://api.devnet.solana.com',
    
    // Volume Bot Config
    volumeBot: {
      tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      minTrade: 0.01,
      maxTrade: 0.05,
      delayMin: 15000, // 15 seconds
      delayMax: 180000, // 3 minutes
      slippage: 10,
      priorityFee: 0.0005,
      minSolBalance: 0.1,
      
      // Anti-detection features
      antiDetection: {
        enabled: true,
        holderPercentage: 15, // 15% wallets only buy and hold
        intentionalErrors: true,
        errorRate: 0.03, // 3% of trades "fail"
        randomPauses: true,
        pauseDuration: [300000, 1800000], // 5-30 minutes
        pauseFrequency: [2, 4], // 2-4 times per day
        trueRandomness: true,
        varianceHigh: 0.8 // 80% variance in amounts
      }
    },
    
    // Pump.fun Sniper Config
    pumpSniper: {
      autoSnipe: false,
      walletsToUse: 50,
      amountPerWallet: 0.5,
      maxTotalBuy: 25,
      speed: 'MAXIMUM',
      priorityFee: 0.01,
      
      // Filters
      filters: {
        minLiquidity: 5,
        maxLiquidity: 100,
        maxHolders: 20,
        blacklistKeywords: ['test', 'scam', 'rug'],
        whitelistKeywords: []
      }
    }
  },
  
  // Wallets (unlimited)
  wallets: [],
  holderWallets: [], // Wallets that only buy and hold
  
  // Stats
  stats: {
    // Volume Bot
    totalVolume: 0,
    tradesExecuted: 0,
    volumePerMinute: 0,
    volumePerHour: 0,
    profitLoss: 0,
    
    // Sniper
    tokensDetected: 0,
    tokensS niped: 0,
    sniperProfit: 0,
    
    // Timing
    startTime: null,
    lastMinuteVolume: [],
    lastHourVolume: []
  },
  
  // Contract monitoring
  contractMonitor: {
    active: false,
    ws: null,
    detectedTokens: []
  },
  
  // Logs
  logs: [],
  
  // Bot intervals
  botInterval: null,
  pauseTimeout: null
};

// ================================
// HELPER FUNCTIONS
// ================================

const addLog = (type, message) => {
  const log = {
    type,
    message,
    timestamp: new Date().toISOString()
  };
  botState.logs.push(log);
  if (botState.logs.length > 200) {
    botState.logs.shift();
  }
  console.log(`[${type.toUpperCase()}] ${message}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// True random with exponential distribution (more natural)
const getRandomNumber = (min, max, exponential = false) => {
  if (exponential && botState.config.volumeBot.antiDetection.trueRandomness) {
    // Exponential distribution - more small values, fewer large values
    const lambda = 2;
    const u = Math.random();
    const exp = -Math.log(u) / lambda;
    const normalized = Math.min(exp, 1);
    return min + (max - min) * normalized;
  }
  return Math.random() * (max - min) + min;
};

// Get random wallet (with Pareto distribution - 80/20 rule)
const getRandomWallet = () => {
  if (!botState.config.volumeBot.antiDetection.enabled) {
    return botState.wallets[Math.floor(Math.random() * botState.wallets.length)];
  }
  
  // Pareto: 20% of wallets do 80% of activity
  const paretoThreshold = 0.2;
  if (Math.random() < 0.8) {
    // Pick from top 20% active wallets
    const topCount = Math.floor(botState.wallets.length * paretoThreshold);
    return botState.wallets[Math.floor(Math.random() * topCount)];
  } else {
    // Pick from remaining 80%
    const topCount = Math.floor(botState.wallets.length * paretoThreshold);
    const index = topCount + Math.floor(Math.random() * (botState.wallets.length - topCount));
    return botState.wallets[index];
  }
};

// Check if should have intentional error
const shouldHaveError = () => {
  const { intentionalErrors, errorRate } = botState.config.volumeBot.antiDetection;
  return intentionalErrors && Math.random() < errorRate;
};

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

// ================================
// TRADING FUNCTIONS
// ================================

// Execute swap (buy or sell) - with profit tracking
const executeSwap = async (connection, keypair, isBuy, amount) => {
  const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';
  const config = botState.mode === 'volume' ? botState.config.volumeBot : botState.config.pumpSniper;
  const tokenAddress = botState.mode === 'volume' 
    ? config.tokenAddress 
    : botState.contractMonitor.currentToken;
  
  try {
    // Intentional error simulation
    if (shouldHaveError()) {
      addLog('warning', `Intentional error (anti-detection): Trade cancelled`);
      return { success: false, intentional: true };
    }
    
    const solanaTracker = new SolanaTracker(keypair, botState.config.rpc);
    
    const [fromToken, toToken] = isBuy
      ? [SOL_ADDRESS, tokenAddress]
      : [tokenAddress, SOL_ADDRESS];

    addLog('info', `${isBuy ? 'BUY' : 'SELL'} - Wallet: ${keypair.publicKey.toBase58().slice(0, 8)}... | Amount: ${isBuy ? amount + ' SOL' : 'ALL'}`);

    const swapResponse = await solanaTracker.getSwapInstructions(
      fromToken,
      toToken,
      isBuy ? amount : 'auto',
      config.slippage || 10,
      keypair.publicKey.toBase58(),
      config.priorityFee
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
  
  botState.stats.lastMinuteVolume.push({ amount: tradeAmount, timestamp: now });
  botState.stats.lastHourVolume.push({ amount: tradeAmount, timestamp: now });
  
  const oneMinuteAgo = now - 60000;
  botState.stats.lastMinuteVolume = botState.stats.lastMinuteVolume.filter(
    t => t.timestamp > oneMinuteAgo
  );
  
  const oneHourAgo = now - 3600000;
  botState.stats.lastHourVolume = botState.stats.lastHourVolume.filter(
    t => t.timestamp > oneHourAgo
  );
  
  botState.stats.volumePerMinute = botState.stats.lastMinuteVolume.reduce(
    (sum, t) => sum + t.amount, 0
  );
  botState.stats.volumePerHour = botState.stats.lastHourVolume.reduce(
    (sum, t) => sum + t.amount, 0
  );
};

// ================================
// VOLUME BOT LOGIC
// ================================

const runVolumeBotCycle = async () => {
  if (!botState.running || botState.wallets.length === 0) {
    return;
  }

  const connection = new Connection(botState.config.rpc, 'confirmed');
  const config = botState.config.volumeBot;
  
  // Random pause (anti-detection)
  if (config.antiDetection.randomPauses && Math.random() < 0.001) {
    const pauseDuration = getRandomNumber(...config.antiDetection.pauseDuration);
    addLog('info', `Random pause: ${(pauseDuration / 60000).toFixed(1)} minutes (anti-detection)`);
    botState.pauseTimeout = setTimeout(runVolumeBotCycle, pauseDuration);
    return;
  }
  
  // Pick random wallet (Pareto distribution)
  const wallet = getRandomWallet();
  const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));

  // Check if this is a holder wallet
  const isHolder = botState.holderWallets.includes(wallet.privateKey);
  if (isHolder) {
    // Holder wallets only buy occasionally, never sell
    if (Math.random() < 0.1) { // 10% chance to buy
      const balance = await checkBalance(connection, keypair);
      if (balance >= config.minSolBalance) {
        const tradeAmount = getRandomNumber(config.minTrade, config.maxTrade, true);
        await executeSwap(connection, keypair, true, tradeAmount);
        updateVolumeStats(tradeAmount);
      }
    }
    
    const delay = getRandomNumber(config.delayMin * 2, config.delayMax * 2); // Longer delays for holders
    setTimeout(runVolumeBotCycle, delay);
    return;
  }

  // Check balance
  const balance = await checkBalance(connection, keypair);
  
  if (balance < config.minSolBalance) {
    addLog('warning', `Wallet ${keypair.publicKey.toBase58().slice(0, 8)}... has insufficient balance: ${balance.toFixed(4)} SOL`);
    const delay = getRandomNumber(config.delayMin, config.delayMax);
    setTimeout(runVolumeBotCycle, delay);
    return;
  }

  // Generate random trade amount with high variance
  const baseAmount = getRandomNumber(config.minTrade, config.maxTrade);
  const variance = config.antiDetection.varianceHigh;
  const tradeAmount = baseAmount * (1 + getRandomNumber(-variance, variance));

  // Execute BUY
  const buyResult = await executeSwap(connection, keypair, true, tradeAmount);
  
  if (buyResult.success && !buyResult.intentional) {
    updateVolumeStats(tradeAmount);
    
    // Wait before selling (random)
    await sleep(getRandomNumber(2000, 8000));
    
    // Execute SELL
    await executeSwap(connection, keypair, false, null);
  }

  // Schedule next cycle with exponential delay distribution
  if (botState.running) {
    const delay = getRandomNumber(config.delayMin, config.delayMax, true);
    setTimeout(runVolumeBotCycle, delay);
  }
};

// ================================
// PUMP.FUN SNIPER LOGIC
// ================================

const startContractMonitoring = () => {
  if (botState.contractMonitor.active) {
    addLog('warning', 'Contract monitoring already active');
    return;
  }
  
  addLog('info', 'Starting contract monitoring...');
  
  // WebSocket connection to pump.fun portal
  try {
    const ws = new WebSocket('wss://pumpportal.fun/api/data');
    
    ws.on('open', () => {
      addLog('success', 'Connected to pump.fun data feed');
      botState.contractMonitor.active = true;
      
      // Subscribe to contract creation events
      ws.send(JSON.stringify({
        method: 'subscribeNewToken'
      }));
    });
    
    ws.on('message', async (data) => {
      try {
        const event = JSON.parse(data.toString());
        
        if (event.txType === 'create') {
          await handleNewToken(event);
        }
      } catch (error) {
        addLog('error', `Error processing message: ${error.message}`);
      }
    });
    
    ws.on('error', (error) => {
      addLog('error', `WebSocket error: ${error.message}`);
    });
    
    ws.on('close', () => {
      addLog('warning', 'Disconnected from pump.fun data feed');
      botState.contractMonitor.active = false;
      
      // Reconnect after 5 seconds
      setTimeout(startContractMonitoring, 5000);
    });
    
    botState.contractMonitor.ws = ws;
  } catch (error) {
    addLog('error', `Failed to start monitoring: ${error.message}`);
  }
};

const handleNewToken = async (tokenData) => {
  botState.stats.tokensDetected++;
  
  const token = {
    address: tokenData.mint,
    name: tokenData.name || 'Unknown',
    symbol: tokenData.symbol || '',
    liquidity: tokenData.initialLiquidity || 0,
    holders: tokenData.holders || 1,
    timestamp: Date.now()
  };
  
  // Add to detected tokens
  botState.contractMonitor.detectedTokens.unshift(token);
  if (botState.contractMonitor.detectedTokens.length > 50) {
    botState.contractMonitor.detectedTokens.pop();
  }
  
  addLog('info', `🆕 New token detected: ${token.name} (${token.address.slice(0, 8)}...) | Liq: ${token.liquidity} SOL`);
  
  // Check filters
  const config = botState.config.pumpSniper;
  const { filters } = config;
  
  // Liquidity filter
  if (token.liquidity < filters.minLiquidity || token.liquidity > filters.maxLiquidity) {
    addLog('info', `Skipped (liquidity filter): ${token.name}`);
    return;
  }
  
  // Holders filter
  if (token.holders > filters.maxHolders) {
    addLog('info', `Skipped (too many holders): ${token.name}`);
    return;
  }
  
  // Blacklist filter
  const nameLower = token.name.toLowerCase();
  if (filters.blacklistKeywords.some(kw => nameLower.includes(kw.toLowerCase()))) {
    addLog('warning', `Skipped (blacklist): ${token.name}`);
    return;
  }
  
  // Auto-snipe if enabled
  if (config.autoSnipe) {
    await executeSnipe(token);
  }
};

const executeSnipe = async (token) => {
  addLog('success', `🎯 AUTO-SNIPING: ${token.name}`);
  
  const config = botState.config.pumpSniper;
  const connection = new Connection(botState.config.rpc, 'confirmed');
  
  // Select wallets to use
  const walletsToUse = botState.wallets.slice(0, config.walletsToUse);
  const amountPerWallet = config.amountPerWallet;
  
  // Execute buys in parallel for maximum speed
  const buyPromises = walletsToUse.map(async (wallet) => {
    const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
    const balance = await checkBalance(connection, keypair);
    
    if (balance < amountPerWallet) {
      return null;
    }
    
    // Temporarily set current token for sniper
    botState.contractMonitor.currentToken = token.address;
    
    return executeSwap(connection, keypair, true, amountPerWallet);
  });
  
  const results = await Promise.all(buyPromises);
  const successCount = results.filter(r => r && r.success).length;
  
  botState.stats.tokensSniped++;
  addLog('success', `✅ Sniped ${token.name} with ${successCount}/${walletsToUse.length} wallets`);
};

// ================================
// API ROUTES
// ================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get status
app.get('/api/status', (req, res) => {
  res.json({
    mode: botState.mode,
    running: botState.running,
    stats: botState.stats,
    walletCount: botState.wallets.length,
    holderCount: botState.holderWallets.length,
    monitoringActive: botState.contractMonitor.active,
    config: botState.config
  });
});

// Set mode
app.post('/api/mode', (req, res) => {
  const { mode } = req.body;
  
  if (!['volume', 'sniper'].includes(mode)) {
    return res.status(400).json({ success: false, error: 'Invalid mode' });
  }
  
  botState.mode = mode;
  addLog('info', `Mode changed to: ${mode}`);
  
  res.json({ success: true, mode: botState.mode });
});

// Get/Update configuration
app.get('/api/config', (req, res) => {
  res.json(botState.config);
});

app.post('/api/config', (req, res) => {
  try {
    botState.config = { ...botState.config, ...req.body };
    addLog('info', 'Configuration updated');
    res.json({ success: true, config: botState.config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wallet management
app.get('/api/wallets', async (req, res) => {
  try {
    const connection = new Connection(botState.config.rpc, 'confirmed');
    
    const walletsWithBalances = await Promise.all(
      botState.wallets.slice(0, 100).map(async (wallet) => { // Limit to first 100 for performance
        const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
        const balance = await checkBalance(connection, keypair);
        const isHolder = botState.holderWallets.includes(wallet.privateKey);
        
        return {
          publicKey: keypair.publicKey.toBase58(),
          balance,
          isHolder
        };
      })
    );
    
    res.json({
      total: botState.wallets.length,
      holders: botState.holderWallets.length,
      wallets: walletsWithBalances
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/wallets', (req, res) => {
  try {
    const { action, privateKeys, count } = req.body;
    
    if (action === 'import' && privateKeys && Array.isArray(privateKeys)) {
      const newWallets = privateKeys.map(pk => ({ privateKey: pk }));
      botState.wallets.push(...newWallets);
      
      // Designate holder wallets (15%)
      if (botState.config.volumeBot.antiDetection.enabled) {
        const holderCount = Math.floor(newWallets.length * 0.15);
        for (let i = 0; i < holderCount; i++) {
          const randomWallet = newWallets[Math.floor(Math.random() * newWallets.length)];
          if (!botState.holderWallets.includes(randomWallet.privateKey)) {
            botState.holderWallets.push(randomWallet.privateKey);
          }
        }
      }
      
      addLog('success', `Imported ${newWallets.length} wallets`);
      res.json({ success: true, count: newWallets.length });
    } else if (action === 'generate' && count) {
      const newWallets = [];
      for (let i = 0; i < count; i++) {
        const keypair = Keypair.generate();
        newWallets.push({
          privateKey: bs58.encode(keypair.secretKey)
        });
      }
      botState.wallets.push(...newWallets);
      
      // Designate holder wallets (15%)
      if (botState.config.volumeBot.antiDetection.enabled) {
        const holderCount = Math.floor(count * 0.15);
        for (let i = 0; i < holderCount; i++) {
          const randomWallet = newWallets[Math.floor(Math.random() * newWallets.length)];
          if (!botState.holderWallets.includes(randomWallet.privateKey)) {
            botState.holderWallets.push(randomWallet.privateKey);
          }
        }
      }
      
      addLog('success', `Generated ${newWallets.length} new wallets (${botState.holderWallets.length} holders)`);
      res.json({ 
        success: true, 
        count: newWallets.length,
        holderCount: botState.holderWallets.length,
        wallets: newWallets.map(w => {
          const kp = Keypair.fromSecretKey(bs58.decode(w.privateKey));
          return {
            publicKey: kp.publicKey.toBase58(),
            privateKey: w.privateKey,
            isHolder: botState.holderWallets.includes(w.privateKey)
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

app.delete('/api/wallets', (req, res) => {
  botState.wallets = [];
  botState.holderWallets = [];
  addLog('info', 'All wallets cleared');
  res.json({ success: true });
});

// Bot control
app.post('/api/start', (req, res) => {
  if (botState.running) {
    return res.json({ success: false, message: 'Bot is already running' });
  }

  if (botState.wallets.length === 0) {
    return res.status(400).json({ success: false, message: 'No wallets available' });
  }

  botState.running = true;
  botState.stats.startTime = new Date().toISOString();
  addLog('success', `Bot started in ${botState.mode} mode`);
  
  if (botState.mode === 'volume') {
    runVolumeBotCycle();
  } else if (botState.mode === 'sniper') {
    startContractMonitoring();
  }
  
  res.json({ success: true, message: 'Bot started successfully', mode: botState.mode });
});

app.post('/api/stop', (req, res) => {
  if (!botState.running) {
    return res.json({ success: false, message: 'Bot is not running' });
  }

  botState.running = false;
  
  if (botState.contractMonitor.ws) {
    botState.contractMonitor.ws.close();
    botState.contractMonitor.active = false;
  }
  
  addLog('info', 'Bot stopped');
  res.json({ success: true, message: 'Bot stopped successfully' });
});

// Sniper manual control
app.post('/api/sniper/buy', async (req, res) => {
  try {
    const { tokenAddress, walletsCount, amountPerWallet } = req.body;
    
    const token = {
      address: tokenAddress,
      name: 'Manual Snipe'
    };
    
    botState.contractMonitor.currentToken = tokenAddress;
    await executeSnipe(token);
    
    res.json({ success: true, message: 'Manual snipe executed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/sniper/dump', async (req, res) => {
  try {
    addLog('warning', '🔴 DUMPING ALL TOKENS...');
    
    const connection = new Connection(botState.config.rpc, 'confirmed');
    
    // Sell from all wallets simultaneously
    const sellPromises = botState.wallets.map(async (wallet) => {
      const keypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
      return executeSwap(connection, keypair, false, null);
    });
    
    const results = await Promise.all(sellPromises);
    const successCount = results.filter(r => r && r.success).length;
    
    addLog('success', `✅ Dumped from ${successCount}/${botState.wallets.length} wallets`);
    
    res.json({ 
      success: true, 
      message: `Dumped from ${successCount} wallets`,
      successCount,
      totalWallets: botState.wallets.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get detected tokens
app.get('/api/sniper/tokens', (req, res) => {
  res.json({
    active: botState.contractMonitor.active,
    tokens: botState.contractMonitor.detectedTokens
  });
});

// Logs
app.get('/api/logs', (req, res) => {
  res.json(botState.logs);
});

app.delete('/api/logs', (req, res) => {
  botState.logs = [];
  res.json({ success: true });
});

// Stats
app.post('/api/stats/reset', (req, res) => {
  botState.stats = {
    totalVolume: 0,
    tradesExecuted: 0,
    volumePerMinute: 0,
    volumePerHour: 0,
    profitLoss: 0,
    tokensDetected: 0,
    tokensSniped: 0,
    sniperProfit: 0,
    startTime: null,
    lastMinuteVolume: [],
    lastHourVolume: []
  };
  addLog('info', 'Stats reset');
  res.json({ success: true });
});

// Volume simulator
app.post('/api/simulator', (req, res) => {
  const { wallets, solPerWallet, duration } = req.body;
  
  // Simple volume calculation
  const avgTrade = 0.035;
  const avgDelay = 60; // seconds
  const tradesPerWallet = (duration * 3600) / avgDelay;
  const totalTrades = wallets * tradesPerWallet;
  const totalVolume = totalTrades * avgTrade;
  const feeLoss = totalVolume * 0.10; // 10% loss to fees
  
  res.json({
    success: true,
    projection: {
      totalVolume: totalVolume.toFixed(2),
      totalTrades: Math.floor(totalTrades),
      solNeeded: (wallets * solPerWallet).toFixed(2),
      feeLoss: feeLoss.toFixed(2),
      solRemaining: ((wallets * solPerWallet) - feeLoss).toFixed(2),
      volumePerHour: (totalVolume / duration).toFixed(2)
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solana Volume Bot V2 - Dual Mode`);
  console.log(`📊 API running on port ${PORT}`);
  console.log(`🔥 Modes: Volume Bot + Pump.fun Sniper`);
  console.log(`✅ Wallets: Unlimited`);
  console.log(`🛡️ Anti-Detection: Advanced`);
  addLog('info', 'Backend server started');
});
