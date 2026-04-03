import React from 'react';

function WalletsPanel({ wallets, onRefresh }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl">
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Active Wallets</h3>
        <button
          onClick={onRefresh}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto">
        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-400">No wallets added yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Manage Wallets" to add some</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet, index) => (
              <div
                key={index}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-mono text-sm truncate">
                      {wallet.publicKey}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Wallet #{index + 1}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className={`text-lg font-bold ${
                      wallet.balance >= 0.1 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {wallet.balance.toFixed(4)}
                    </p>
                    <p className="text-gray-400 text-xs">SOL</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletsPanel;
