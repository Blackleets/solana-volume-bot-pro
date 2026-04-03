import React, { useState, useEffect } from 'react';

const ContractMonitor = ({ apiUrl }) => {
  const [tokens, setTokens] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [filters, setFilters] = useState({
    minLiquidity: 5,
    maxLiquidity: 100,
    maxHolders: 20
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${apiUrl}/sniper/tokens`);
        const data = await response.json();
        setTokens(data.tokens || []);
        setMonitoring(data.active);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 2000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const snipeToken = async (tokenAddress) => {
    if (!window.confirm('Are you sure you want to snipe this token?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/sniper/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress,
          walletsCount: 50,
          amountPerWallet: 0.5
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Snipe executed successfully!');
      }
    } catch (error) {
      console.error('Error sniping token:', error);
      alert('Error executing snipe');
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="contract-monitor">
      <div className="monitor-header">
        <h2>📡 Contract Monitor</h2>
        <div className="monitor-status">
          {monitoring ? (
            <span className="status-active">🟢 MONITORING ACTIVE</span>
          ) : (
            <span className="status-inactive">⚫ MONITORING INACTIVE</span>
          )}
        </div>
      </div>

      <div className="tokens-feed">
        <h3>🆕 Live Token Feed</h3>
        {tokens.length === 0 ? (
          <div className="empty-state">
            <p>No tokens detected yet. Monitoring pump.fun...</p>
          </div>
        ) : (
          <div className="tokens-list">
            {tokens.slice(0, 10).map((token, index) => (
              <div key={index} className="token-card">
                <div className="token-header">
                  <div>
                    <h4>{token.name}</h4>
                    <p className="token-address">
                      {token.address.slice(0, 8)}...{token.address.slice(-8)}
                    </p>
                  </div>
                  <span className="token-time">{getTimeAgo(token.timestamp)}</span>
                </div>
                
                <div className="token-stats">
                  <div className="stat">
                    <span className="stat-label">Liquidity:</span>
                    <span className="stat-value">{token.liquidity} SOL</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Holders:</span>
                    <span className="stat-value">{token.holders}</span>
                  </div>
                </div>

                <div className="token-actions">
                  <button 
                    className="btn btn-snipe"
                    onClick={() => snipeToken(token.address)}
                  >
                    🎯 Snipe Now
                  </button>
                  <button className="btn btn-skip">
                    ❌ Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractMonitor;
