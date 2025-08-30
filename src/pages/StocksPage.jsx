import React from 'react';
import Stocks from '../components/Stocks';

const StocksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Stocks</h1>
        <p className="text-lg text-gray-600">
          Monitor real-time market data and make informed trading decisions.
        </p>
      </div>
      <Stocks />
    </div>
  );
};

export default StocksPage;