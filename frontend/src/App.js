import React, { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import VolumeSimulator from './components/VolumeSimulator';
import ContractMonitor from './components/ContractMonitor';
import FastTrading from './components/FastTrading';
import AntiDetectionGuide from './components/AntiDetectionGuide';
import WalletManager from './components/WalletManager';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  // States
  const [mode, setMode] = useState('volume'); // 'volume' or 'sniper'
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [botRunning, setBotRunning] = useState(false);
  const [stats, setStats] = useState({
    totalVolume: 0,
    tradesExecuted: 0,
    tokensDetected: 0,
    tokensSniped: 0
  });
  const [wallets, setWallets] = useState([]);
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, wallets, simulator, guide

  // Fetch status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        setBotRunning(data.running);
        setStats(data.stats);
        setMode(data.mode);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/config`);
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/logs`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleModeChange = async (newMode) => {
    try {
      const response = await fetch(`${API_URL}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      const data = await response.json();
      if (data.success) {
        setMode(newMode);
      }
    } catch (error) {
      console.error('Error changing mode:', error);
    }
  };

  const handleStartBot = async () => {
    try {
      const response = await fetch(`${API_URL}/start`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setBotRunning(true);
      }
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  };

  const handleStopBot = async () => {
    try {
      const response = await fetch(`${API_URL}/stop`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setBotRunning(false);
      }
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🔥 Solana Volume Bot V2</h1>
          <div className="header-right">
            <div className="mode-selector">
              <button 
                className={`mode-btn ${mode === 'volume' ? 'active' : ''}`}
                onClick={() => handleModeChange('volume')}
              >
                📊 Volume Bot
              </button>
              <button 
                className={`mode-btn ${mode === 'sniper' ? 'active' : ''}`}
                onClick={() => handleModeChange('sniper')}
              >
                🎯 Pump Sniper
              </button>
            </div>
            <WalletConnect 
              connected={connected}
              walletAddress={walletAddress}
              onConnect={(address) => {
                setConnected(true);
                setWalletAddress(address);
              }}
              onDisconnect={() => {
                setConnected(false);
                setWalletAddress('');
              }}
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📈 Dashboard
        </button>
        <button 
          className={activeTab === 'wallets' ? 'active' : ''}
          onClick={() => setActiveTab('wallets')}
        >
          💼 Wallets
        </button>
        <button 
          className={activeTab === 'simulator' ? 'active' : ''}
          onClick={() => setActiveTab('simulator')}
        >
          🧮 Simulator
        </button>
        <button 
          className={activeTab === 'guide' ? 'active' : ''}
          onClick={() => setActiveTab('guide')}
        >
          📚 Guía Anti-Detección
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Volume</h3>
                <p className="stat-value">{stats.totalVolume.toFixed(4)} SOL</p>
              </div>
              <div className="stat-card">
                <h3>Trades Executed</h3>
                <p className="stat-value">{stats.tradesExecuted}</p>
              </div>
              {mode === 'sniper' && (
                <>
                  <div className="stat-card">
                    <h3>Tokens Detected</h3>
                    <p className="stat-value">{stats.tokensDetected}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Tokens Sniped</h3>
                    <p className="stat-value">{stats.tokensSniped}</p>
                  </div>
                </>
              )}
            </div>

            {/* Bot Control */}
            <div className="bot-control">
              <h2>Bot Control</h2>
              <div className="control-buttons">
                {!botRunning ? (
                  <button className="btn btn-start" onClick={handleStartBot}>
                    🟢 Start Bot
                  </button>
                ) : (
                  <button className="btn btn-stop" onClick={handleStopBot}>
                    🔴 Stop Bot
                  </button>
                )}
              </div>
              <div className="status-indicator">
                Status: {botRunning ? '🟢 Running' : '⚫ Stopped'} | Mode: {mode === 'volume' ? '📊 Volume' : '🎯 Sniper'}
              </div>
            </div>

            {/* Mode-specific components */}
            {mode === 'sniper' && (
              <>
                <ContractMonitor apiUrl={API_URL} />
                <FastTrading apiUrl={API_URL} />
              </>
            )}

            {/* Logs */}
            <div className="logs-section">
              <h2>Activity Logs</h2>
              <div className="logs-container">
                {logs.slice().reverse().slice(0, 20).map((log, index) => (
                  <div key={index} className={`log-entry log-${log.type}`}>
                    <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="log-type">[{log.type.toUpperCase()}]</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <WalletManager 
            apiUrl={API_URL}
            wallets={wallets}
            onWalletsUpdate={setWallets}
          />
        )}

        {activeTab === 'simulator' && (
          <VolumeSimulator apiUrl={API_URL} />
        )}

        {activeTab === 'guide' && (
          <AntiDetectionGuide />
        )}
      </main>
    </div>
  );
}

export default App;
