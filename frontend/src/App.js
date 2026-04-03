import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ConfigModal from './components/ConfigModal';
import WalletModal from './components/WalletModal';
import StatsCard from './components/StatsCard';
import LogsPanel from './components/LogsPanel';
import WalletsPanel from './components/WalletsPanel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [botStatus, setBotStatus] = useState({
    running: false,
    stats: {
      totalVolume: 0,
      tradesExecuted: 0,
      volumePerMinute: 0,
      volumePerHour: 0,
      startTime: null
    },
    walletCount: 0
  });
  
  const [config, setConfig] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch bot status
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setBotStatus(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Fetch configuration
  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/config`);
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  // Fetch wallets
  const fetchWallets = async () => {
    try {
      const response = await axios.get(`${API_URL}/wallets`);
      setWallets(response.data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Start bot
  const handleStart = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/start`);
      await fetchStatus();
    } catch (error) {
      alert(error.response?.data?.message || 'Error starting bot');
    }
    setLoading(false);
  };

  // Stop bot
  const handleStop = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/stop`);
      await fetchStatus();
    } catch (error) {
      alert('Error stopping bot');
    }
    setLoading(false);
  };

  // Update configuration
  const handleConfigUpdate = async (newConfig) => {
    try {
      await axios.post(`${API_URL}/config`, newConfig);
      await fetchConfig();
      setShowConfigModal(false);
    } catch (error) {
      alert('Error updating configuration');
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchStatus();
    fetchConfig();
    fetchWallets();
    fetchLogs();

    const interval = setInterval(() => {
      fetchStatus();
      fetchWallets();
      fetchLogs();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-purple-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Solana Volume Bot Dashboard
                </h1>
                <p className="text-purple-300 text-sm mt-1">
                  Professional Trading Volume Generator
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                botStatus.running 
                  ? 'bg-green-500 text-white animate-pulse' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {botStatus.running ? '🟢 Running' : '⚫ Stopped'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configure Bot</span>
          </button>

          <button
            onClick={() => setShowWalletModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Manage Wallets ({botStatus.walletCount})</span>
          </button>

          {!botStatus.running ? (
            <button
              onClick={handleStart}
              disabled={loading || botStatus.walletCount === 0}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Bot</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span>Stop Bot</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Volume"
            value={`${botStatus.stats.totalVolume.toFixed(4)} SOL`}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            gradient="from-blue-500 to-blue-600"
          />

          <StatsCard
            title="Trades Executed"
            value={botStatus.stats.tradesExecuted}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            gradient="from-green-500 to-green-600"
          />

          <StatsCard
            title="Volume/Minute"
            value={`${botStatus.stats.volumePerMinute.toFixed(4)} SOL`}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-purple-500 to-purple-600"
          />

          <StatsCard
            title="Volume/Hour"
            value={`${botStatus.stats.volumePerHour.toFixed(4)} SOL`}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Wallets and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletsPanel wallets={wallets} onRefresh={fetchWallets} />
          <LogsPanel logs={logs} />
        </div>
      </main>

      {/* Modals */}
      {showConfigModal && config && (
        <ConfigModal
          config={config}
          onClose={() => setShowConfigModal(false)}
          onSave={handleConfigUpdate}
        />
      )}

      {showWalletModal && (
        <WalletModal
          onClose={() => setShowWalletModal(false)}
          onWalletsAdded={() => {
            fetchWallets();
            setShowWalletModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
