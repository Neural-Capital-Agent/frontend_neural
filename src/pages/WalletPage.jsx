import React from 'react';
import Wallet from '../components/Wallet';

const WalletPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Wallet</h1>
        <p className="text-lg text-gray-600">
          Manage your funds, track your balance, and review transaction history.
        </p>
      </div>
      <Wallet />
    </div>
  );
};

export default WalletPage;