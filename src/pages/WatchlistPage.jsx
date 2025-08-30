import React from 'react';
import Watchlist from '../components/Watchlist';

const WatchlistPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Watchlist</h1>
        <p className="text-lg text-gray-600">
          Keep track of stocks you're interested in and receive AI-powered insights.
        </p>
      </div>
      <Watchlist />
    </div>
  );
};

export default WatchlistPage;