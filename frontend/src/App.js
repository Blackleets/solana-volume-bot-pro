import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [mode, setMode] = useState('volume');
  const [botRunning, setBotRunning] = useState(false);
  const [stats, setStats] = useState({
    totalVolume: 0,
    tradesExecuted: 0,
    tokensDetected: 0,
    tokensSniped: 0
  });
  const [logs, setLogs] = useState([]);
  const [walletCount, setWalletCount] = useState(0);
  const [generatingCount, setGeneratingCount] = useState(10);
  const [generatedWallets, setGeneratedWallets] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        setBotRunning(data.running);
        setStats(data.stats);
        setMode(data.mode);
        setWalletCount(data.walletCount);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/logs`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = async (newMode) => {
    try {
      await fetch(`${API_URL}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      setMode(newMode);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStart = async () => {
    try {
      const response = await fetch(`${API_URL}/start`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setBotRunning(true);
        alert('Bot iniciado correctamente!');
      } else {
        alert(data.message || 'Error al iniciar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar bot');
    }
  };

  const handleStop = async () => {
    try {
      await fetch(`${API_URL}/stop`, { method: 'POST' });
      setBotRunning(false);
      alert('Bot detenido');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGenerateWallets = async () => {
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          count: parseInt(generatingCount)
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setGeneratedWallets(data.wallets);
        alert(`${data.count} wallets generadas! Descarga el JSON.`);
        
        // Auto-download
        const blob = new Blob([JSON.stringify(data.wallets, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallets-${Date.now()}.json`;
        a.click();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generando wallets');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🔥 Solana Volume Bot V2</h1>
        <div className="mode-selector">
          <button 
            className={mode === 'volume' ? 'active' : ''}
            onClick={() => handleModeChange('volume')}
          >
            📊 Volume Bot
          </button>
          <button 
            className={mode === 'sniper' ? 'active' : ''}
            onClick={() => handleModeChange('sniper')}
          >
            🎯 Pump Sniper
          </button>
        </div>
      </header>

      <main>
        <section className="stats">
          <div className="stat-card">
            <h3>Total Volume</h3>
            <p>{stats.totalVolume.toFixed(4)} SOL</p>
          </div>
          <div className="stat-card">
            <h3>Trades</h3>
            <p>{stats.tradesExecuted}</p>
          </div>
          <div className="stat-card">
            <h3>Wallets</h3>
            <p>{walletCount}</p>
          </div>
          {mode === 'sniper' && (
            <>
              <div className="stat-card">
                <h3>Tokens Detected</h3>
                <p>{stats.tokensDetected}</p>
              </div>
              <div className="stat-card">
                <h3>Tokens Sniped</h3>
                <p>{stats.tokensSniped}</p>
              </div>
            </>
          )}
        </section>

        <section className="wallet-gen">
          <h2>💼 Generar Wallets</h2>
          <div className="input-group">
            <input 
              type="number" 
              value={generatingCount}
              onChange={(e) => setGeneratingCount(e.target.value)}
              placeholder="Cantidad"
            />
            <button onClick={handleGenerateWallets}>
              ✨ Generar
            </button>
          </div>
          <p style={{fontSize: '0.9rem', color: '#888'}}>
            Sin límite - genera cuantas quieras (10, 100, 1000+)
          </p>
        </section>

        <section className="controls">
          <h2>Control del Bot</h2>
          <div className="button-group">
            {!botRunning ? (
              <button className="btn-start" onClick={handleStart}>
                🟢 INICIAR BOT
              </button>
            ) : (
              <button className="btn-stop" onClick={handleStop}>
                🔴 DETENER BOT
              </button>
            )}
          </div>
          <p className="status">
            Estado: {botRunning ? '🟢 Corriendo' : '⚫ Detenido'} | Modo: {mode === 'volume' ? '📊 Volume' : '🎯 Sniper'}
          </p>
        </section>

        <section className="logs">
          <h2>📝 Activity Logs</h2>
          <div className="logs-container">
            {logs.slice().reverse().slice(0, 20).map((log, index) => (
              <div key={index} className={`log-entry log-${log.type}`}>
                <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="log-type">[{log.type.toUpperCase()}]</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </section>

        {generatedWallets.length > 0 && (
          <section className="wallets-display">
            <h2>⚠️ WALLETS GENERADAS - GUARDA ESTAS PRIVATE KEYS</h2>
            <div className="wallets-list">
              {generatedWallets.map((wallet, index) => (
                <div key={index} className="wallet-item">
                  <strong>Wallet {index + 1}:</strong>
                  <div style={{fontSize: '0.85rem', fontFamily: 'monospace'}}>
                    <div>Public: {wallet.publicKey}</div>
                    <div style={{color: '#ff4444'}}>Private: {wallet.privateKey}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
