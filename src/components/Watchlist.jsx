import React from 'react';

const Watchlist = () => {
  // Mock watchlist data
  const watchlistItems = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 188.23, change: 1.27, changePercent: 0.68, alerts: 2 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 156.87, change: 3.42, changePercent: 2.23, alerts: 0 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 204.12, change: -5.38, changePercent: -2.57, alerts: 1 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 116.32, change: 2.14, changePercent: 1.87, alerts: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 my-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Watchlist</h2>
        <div className="flex space-x-2">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Symbol
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {watchlistItems.map((item) => (
          <div key={item.symbol} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                {item.symbol.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.symbol}</h3>
                <p className="text-sm text-gray-500">{item.name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-6">
                <p className="text-lg font-medium">${item.price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                </p>
              </div>
              
              <div className="flex space-x-2">
                {item.alerts > 0 && (
                  <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                    {item.alerts}
                  </div>
                )}
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center py-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">Set price alerts for real-time notifications</p>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          Manage Alerts
        </button>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-indigo-800 mb-2">AI Recommendations</h3>
        <p className="text-indigo-600 text-sm">
          Based on your watchlist, our AI suggests exploring: <span className="font-medium">META, AMZN, MSFT</span>
        </p>
      </div>
    </div>
  );
};

export default Watchlist;