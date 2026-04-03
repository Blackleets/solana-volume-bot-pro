import React, { useState } from 'react';

function ConfigModal({ config, onClose, onSave }) {
  const [formData, setFormData] = useState(config);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Bot Configuration</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Network
            </label>
            <select
              name="network"
              value={formData.network}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="devnet">Devnet (Testing)</option>
              <option value="mainnet">Mainnet (Production)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Use Devnet for testing with fake SOL
            </p>
          </div>

          {/* RPC URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              RPC URL
            </label>
            <input
              type="text"
              name="rpc"
              value={formData.rpc}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://api.devnet.solana.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              Solana RPC endpoint URL
            </p>
          </div>

          {/* Token Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token Address
            </label>
            <input
              type="text"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Token mint address"
            />
            <p className="text-xs text-gray-400 mt-1">
              SPL token mint address to trade
            </p>
          </div>

          {/* Trade Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Trade (SOL)
              </label>
              <input
                type="number"
                name="minTrade"
                value={formData.minTrade}
                onChange={handleChange}
                step="0.001"
                min="0.001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Trade (SOL)
              </label>
              <input
                type="number"
                name="maxTrade"
                value={formData.maxTrade}
                onChange={handleChange}
                step="0.001"
                min="0.001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Delay Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Delay (ms)
              </label>
              <input
                type="number"
                name="delayMin"
                value={formData.delayMin}
                onChange={handleChange}
                step="100"
                min="1000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Delay (ms)
              </label>
              <input
                type="number"
                name="delayMax"
                value={formData.delayMax}
                onChange={handleChange}
                step="100"
                min="1000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slippage (%)
              </label>
              <input
                type="number"
                name="slippage"
                value={formData.slippage}
                onChange={handleChange}
                step="1"
                min="1"
                max="50"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Fee (SOL)
              </label>
              <input
                type="number"
                name="priorityFee"
                value={formData.priorityFee}
                onChange={handleChange}
                step="0.0001"
                min="0.0001"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Min Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min SOL Balance Required
            </label>
            <input
              type="number"
              name="minSolBalance"
              value={formData.minSolBalance}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum SOL balance required to use a wallet
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all shadow-lg"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfigModal;
