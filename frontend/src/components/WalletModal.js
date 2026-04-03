import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function WalletModal({ onClose, onWalletsAdded }) {
  const [action, setAction] = useState('generate');
  const [count, setCount] = useState(3);
  const [privateKeys, setPrivateKeys] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedWallets, setGeneratedWallets] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/wallets`, {
        action: 'generate',
        count: parseInt(count)
      });
      setGeneratedWallets(response.data.wallets);
    } catch (error) {
      alert('Error generating wallets');
    }
    setLoading(false);
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const keys = privateKeys.split('\n').filter(k => k.trim());
      await axios.post(`${API_URL}/wallets`, {
        action: 'import',
        privateKeys: keys
      });
      onWalletsAdded();
    } catch (error) {
      alert('Error importing wallets');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Wallet Management</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setAction('generate')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                action === 'generate'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Generate New Wallets
            </button>
            <button
              onClick={() => setAction('import')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                action === 'import'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Import Private Keys
            </button>
          </div>

          {action === 'generate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Wallets
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Wallets'}
              </button>

              {generatedWallets && (
                <div className="mt-4 space-y-3">
                  <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm font-medium">
                      ⚠️ Save these private keys securely! They won't be shown again.
                    </p>
                  </div>
                  {generatedWallets.map((wallet, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">Public Key:</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-white text-sm font-mono flex-1 truncate">
                            {wallet.publicKey}
                          </p>
                          <button
                            onClick={() => copyToClipboard(wallet.publicKey)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Private Key:</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-red-400 text-sm font-mono flex-1 truncate">
                            {wallet.privateKey}
                          </p>
                          <button
                            onClick={() => copyToClipboard(wallet.privateKey)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={onWalletsAdded}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

          {action === 'import' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Private Keys (one per line)
                </label>
                <textarea
                  value={privateKeys}
                  onChange={(e) => setPrivateKeys(e.target.value)}
                  rows="10"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
                  placeholder="Enter private keys, one per line..."
                />
              </div>
              <button
                onClick={handleImport}
                disabled={loading || !privateKeys.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import Wallets'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletModal;
