import React, { useEffect, useState } from "react";


const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  useEffect(() => {
    // Fetch stock data from an API or use mock data
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/stocks');
      const data = await response.json();
      setStocks(data.stocks);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 my-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Market Overview</h2>
        <div className="flex space-x-2">
          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition-colors">
            Refresh
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Stock
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-semibold text-indigo-700">{stock.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stock.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${stock.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stock.change >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Buy</button>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Sell</button>
                  <button className="text-gray-600 hover:text-gray-900">Watch</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Market Insights</h3>
        <p className="text-gray-600">
          Stay updated with the latest market trends and make informed investment decisions.
          Our AI-powered analysis provides real-time insights into market movements.
        </p>
      </div>
    </div>
  );
};

export default Stocks;