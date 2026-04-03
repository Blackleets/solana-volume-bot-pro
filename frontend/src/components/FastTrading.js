import React, { useState } from 'react';

const FastTrading = ({ apiUrl }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState(0.5);
  const [walletsCount, setWalletsCount] = useState(50);
  const [loading, setLoading] = useState(false);

  const executeBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sniper/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress,
          walletsCount,
          amountPerWallet: amount
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Buy executed successfully!');
      }
    } catch (error) {
      console.error('Error executing buy:', error);
      alert('Error executing buy');
    }
    setLoading(false);
  };

  const executeDumpAll = async () => {
    if (!window.confirm('⚠️ DUMP ALL TOKENS? This will sell from ALL wallets immediately!')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sniper/dump`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        alert(`Dumped successfully from ${data.successCount} wallets!`);
      }
    } catch (error) {
      console.error('Error dumping:', error);
      alert('Error executing dump');
    }
    setLoading(false);
  };

  return (
    <div className="fast-trading">
      <h2>⚡ Fast Trading</h2>
      
      <div className="trading-panel">
        <div className="input-section">
          <div className="input-group">
            <label>Token Address</label>
            <input 
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Token CA address..."
              className="input-large"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Amount per Wallet (SOL)</label>
              <input 
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                min="0.01"
              />
            </div>

            <div className="input-group">
              <label>Number of Wallets</label>
              <input 
                type="number"
                value={walletsCount}
                onChange={(e) => setWalletsCount(parseInt(e.target.value))}
                min="1"
                max="500"
              />
            </div>
          </div>

          <div className="trading-summary">
            <p>Total Buy: <strong>{(amount * walletsCount).toFixed(2)} SOL</strong></p>
            <p>Using: <strong>{walletsCount} wallets</strong></p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-buy-large"
            onClick={executeBuy}
            disabled={loading || !tokenAddress}
          >
            {loading ? '⏳ Executing...' : '🟢 BUY NOW'}
          </button>

          <button 
            className="btn btn-dump-large"
            onClick={executeDumpAll}
            disabled={loading}
          >
            {loading ? '⏳ Dumping...' : '🔴 DUMP ALL'}
          </button>
        </div>

        <div className="warning-box">
          <p>⚠️ <strong>Warning:</strong> Fast trading executes immediately without confirmation.</p>
          <p>DUMP ALL will sell tokens from ALL wallets in 5-15 seconds.</p>
        </div>
      </div>
    </div>
  );
};

export default FastTrading;
