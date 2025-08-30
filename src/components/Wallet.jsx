import React from 'react';

const Wallet = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Wallet</h2>
      
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md mb-8">
        <p className="text-lg opacity-80 mb-1">Current Balance</p>
        <p className="text-4xl font-bold tracking-tight">$10,000</p>
      </div>
      
      <div className="flex gap-4 mt-6">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
          Deposit
        </button>
        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
          Withdraw
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
        <p className="text-gray-500 text-center italic">No recent transactions</p>
      </div>
    </div>
  );
};

export default Wallet;