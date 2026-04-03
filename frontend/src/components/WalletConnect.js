import React, { useEffect, useState } from 'react';

const WalletConnect = ({ connected, walletAddress, onConnect, onDisconnect }) => {
  const [phantom, setPhantom] = useState(null);

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setPhantom(window.solana);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!phantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await phantom.connect();
      const address = response.publicKey.toString();
      onConnect(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    if (phantom) {
      phantom.disconnect();
    }
    onDisconnect();
  };

  return (
    <div className="wallet-connect">
      {!connected ? (
        <button className="btn btn-connect" onClick={connectWallet}>
          {phantom ? '🔗 Connect Wallet' : '📥 Install Phantom'}
        </button>
      ) : (
        <div className="wallet-connected">
          <span className="wallet-address">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>
          <button className="btn btn-disconnect" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
