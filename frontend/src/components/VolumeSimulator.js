import React, { useState } from 'react';

const VolumeSimulator = ({ apiUrl }) => {
  const [wallets, setWallets] = useState(100);
  const [solPerWallet, setSolPerWallet] = useState(0.5);
  const [duration, setDuration] = useState(1); // hours
  const [projection, setProjection] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/simulator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallets,
          solPerWallet,
          duration
        })
      });
      const data = await response.json();
      setProjection(data.projection);
    } catch (error) {
      console.error('Error running simulation:', error);
    }
    setLoading(false);
  };

  const generateChart = () => {
    if (!projection) return null;

    // Simple text-based chart
    const hours = parseInt(duration);
    const volumePerHour = parseFloat(projection.volumePerHour);
    
    const bars = [];
    for (let i = 1; i <= hours; i++) {
      const volume = volumePerHour * i;
      const barLength = Math.min(Math.floor((volume / projection.totalVolume) * 50), 50);
      bars.push(
        <div key={i} className="chart-bar">
          <span className="chart-label">Hour {i}</span>
          <div className="chart-bar-container">
            <div 
              className="chart-bar-fill" 
              style={{ width: `${(volume / projection.totalVolume) * 100}%` }}
            ></div>
          </div>
          <span className="chart-value">{volume.toFixed(2)} SOL</span>
        </div>
      );
    }
    
    return <div className="chart">{bars}</div>;
  };

  return (
    <div className="volume-simulator">
      <h2>🧮 Volume Simulator & Calculator</h2>
      
      <div className="simulator-layout">
        {/* Input Panel */}
        <div className="input-panel">
          <h3>Configuration</h3>
          
          <div className="input-group">
            <label>Number of Wallets</label>
            <input 
              type="number"
              value={wallets}
              onChange={(e) => setWallets(parseInt(e.target.value))}
              min="1"
              max="10000"
            />
            <span className="input-help">No hay límite - usa cuantas quieras</span>
          </div>

          <div className="input-group">
            <label>SOL per Wallet (average)</label>
            <input 
              type="number"
              step="0.1"
              value={solPerWallet}
              onChange={(e) => setSolPerWallet(parseFloat(e.target.value))}
              min="0.1"
              max="100"
            />
          </div>

          <div className="input-group">
            <label>Duration (hours)</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            >
              <option value="1">1 hour</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="168">1 week</option>
            </select>
          </div>

          <button 
            className="btn btn-primary btn-large"
            onClick={runSimulation}
            disabled={loading}
          >
            {loading ? '⏳ Calculating...' : '▶️ Run Simulation'}
          </button>
        </div>

        {/* Results Panel */}
        {projection && (
          <div className="results-panel">
            <h3>📊 Projected Results</h3>
            
            <div className="results-grid">
              <div className="result-card">
                <h4>Total Volume Generated</h4>
                <p className="result-value">{projection.totalVolume} SOL</p>
              </div>
              
              <div className="result-card">
                <h4>Total Trades</h4>
                <p className="result-value">{projection.totalTrades}</p>
              </div>
              
              <div className="result-card">
                <h4>Volume per Hour</h4>
                <p className="result-value">{projection.volumePerHour} SOL/h</p>
              </div>
              
              <div className="result-card cost">
                <h4>SOL Needed</h4>
                <p className="result-value">{projection.solNeeded} SOL</p>
              </div>
              
              <div className="result-card cost">
                <h4>Fee Loss (10%)</h4>
                <p className="result-value negative">-{projection.feeLoss} SOL</p>
              </div>
              
              <div className="result-card profit">
                <h4>SOL Remaining</h4>
                <p className="result-value">{projection.solRemaining} SOL</p>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <h4>Volume Over Time</h4>
              {generateChart()}
            </div>

            {/* Anti-Detection Analysis */}
            <div className="detection-analysis">
              <h4>🛡️ Detection Risk Analysis</h4>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <span className="analysis-label">Bubble Map Detection:</span>
                  <span className="analysis-value safe">✅ Safe</span>
                  <p className="analysis-note">
                    With {wallets} wallets and randomized funding, pattern is organic
                  </p>
                </div>
                
                <div className="analysis-item">
                  <span className="analysis-label">Trade Pattern:</span>
                  <span className="analysis-value safe">✅ Natural</span>
                  <p className="analysis-note">
                    Delays: 15-180 sec (random), amounts: ±80% variance
                  </p>
                </div>
                
                <div className="analysis-item">
                  <span className="analysis-label">Holder Analysis:</span>
                  <span className="analysis-value safe">✅ Organic</span>
                  <p className="analysis-note">
                    {Math.floor(wallets * 0.15)} wallets designated as holders (buy only)
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h4>💡 Recommendations</h4>
              <ul>
                <li>✅ Fund wallets from multiple sources at different times</li>
                <li>✅ Use variable amounts: 0.3, 0.7, 1.2, 0.9 SOL (not all 1.0)</li>
                <li>✅ Enable anti-detection mode (randomization + errors)</li>
                <li>✅ Let 15% of wallets be "holders" (never sell)</li>
                <li>⚠️ Recommended pool liquidity: ${(parseFloat(projection.totalVolume) * 140 * 10).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeSimulator;
