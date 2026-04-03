import React, { useState, useEffect } from 'react';

const WalletManager = ({ apiUrl, wallets, onWalletsUpdate }) => {
  const [generatingCount, setGeneratingCount] = useState(10);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [walletData, setWalletData] = useState({ total: 0, holders: 0, wallets: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch(`${apiUrl}/wallets`);
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const generateWallets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          count: parseInt(generatingCount)
        })
      });
      const data = await response.json();
      
      if (data.success) {
        // Show generated wallets with private keys
        setShowPrivateKeys(true);
        await fetchWallets();
        
        // Download private keys automatically
        downloadPrivateKeys(data.wallets);
      }
    } catch (error) {
      console.error('Error generating wallets:', error);
    }
    setLoading(false);
  };

  const downloadPrivateKeys = (wallets) => {
    const data = wallets.map(w => ({
      publicKey: w.publicKey,
      privateKey: w.privateKey,
      isHolder: w.isHolder
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallets-${Date.now()}.json`;
    a.click();
  };

  const exportWallets = async () => {
    try {
      const response = await fetch(`${apiUrl}/wallets`);
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data.wallets, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallets-export-${Date.now()}.json`;
      a.click();
    } catch (error) {
      console.error('Error exporting wallets:', error);
    }
  };

  const importWallets = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const wallets = JSON.parse(event.target.result);
        const privateKeys = wallets.map(w => w.privateKey);
        
        const response = await fetch(`${apiUrl}/wallets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'import',
            privateKeys
          })
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchWallets();
          alert(`Imported ${data.count} wallets successfully!`);
        }
      } catch (error) {
        console.error('Error importing wallets:', error);
        alert('Error importing wallets. Check console for details.');
      }
    };
    reader.readAsText(file);
  };

  const clearWallets = async () => {
    if (!window.confirm('Are you sure you want to clear ALL wallets? This cannot be undone!')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/wallets`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchWallets();
        setShowPrivateKeys(false);
      }
    } catch (error) {
      console.error('Error clearing wallets:', error);
    }
  };

  return (
    <div className="wallet-manager">
      <h2>💼 Wallet Management</h2>
      
      {/* Summary */}
      <div className="wallet-summary">
        <div className="summary-card">
          <h3>Total Wallets</h3>
          <p className="big-number">{walletData.total}</p>
        </div>
        <div className="summary-card">
          <h3>Holder Wallets</h3>
          <p className="big-number">{walletData.holders}</p>
          <span className="help-text">15% auto-designated as holders (buy only, never sell)</span>
        </div>
        <div className="summary-card">
          <h3>Active Traders</h3>
          <p className="big-number">{walletData.total - walletData.holders}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="wallet-actions">
        <div className="action-group">
          <h3>Generate New Wallets</h3>
          <div className="input-group">
            <input 
              type="number" 
              value={generatingCount}
              onChange={(e) => setGeneratingCount(e.target.value)}
              min="1"
              max="10000"
              placeholder="Number of wallets"
            />
            <button 
              className="btn btn-primary"
              onClick={generateWallets}
              disabled={loading}
            >
              {loading ? '⏳ Generating...' : '✨ Generate Wallets'}
            </button>
          </div>
          <p className="help-text">
            ⚠️ No hay límite. Puedes generar cuantas quieras (10, 100, 1000+)
          </p>
        </div>

        <div className="action-group">
          <h3>Import / Export</h3>
          <div className="button-row">
            <label className="btn btn-secondary">
              📥 Import JSON
              <input 
                type="file" 
                accept=".json"
                onChange={importWallets}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn btn-secondary" onClick={exportWallets}>
              📤 Export All
            </button>
            <button className="btn btn-danger" onClick={clearWallets}>
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Wallet List */}
      <div className="wallet-list">
        <h3>Wallets (showing first 100)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Public Key</th>
                <th>Balance</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {walletData.wallets.map((wallet, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="mono">
                    {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
                  </td>
                  <td>{wallet.balance.toFixed(4)} SOL</td>
                  <td>
                    {wallet.isHolder ? (
                      <span className="badge badge-holder">🔒 Holder</span>
                    ) : (
                      <span className="badge badge-trader">⚡ Trader</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {walletData.total > 100 && (
            <p className="table-note">
              Showing 100 of {walletData.total} wallets. All wallets are active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletManager;
