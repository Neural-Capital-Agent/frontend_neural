import React, { useEffect, useState } from "react";


const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  useEffect(() => {
    // Fetch stock data from an API or use mock data
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/api/v1/stocks');
      const data = await response.json();
      setStocks(data.stocks);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-8 mx-4 my-6 relative">
      {/* Inner glow effect at the top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-[#F3ECDC]/10 rounded-t-xl"></div>
      <div className="absolute inset-x-6 top-0 bottom-0 bg-gradient-to-b from-[#F3ECDC]/5 to-transparent h-12 rounded-t-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#F3ECDC] tracking-wide">Market Overview</h2>
        <div className="flex space-x-2">
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#C87933]/20">
          <thead className="bg-[#0A0F1C]/80">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C87933]/20">
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-[#0A0F1C]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-semibold text-[#C87933]">{stock.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#F3ECDC]">{stock.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#F3ECDC]">${stock.price.toFixed(2)}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stock.change >= 0 
                      ? 'bg-[#163832] text-[#4ade80]' 
                      : 'bg-[#3b1c26] text-[#f87171]'
                  }`}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-[#C87933] hover:text-[#D98324] transition-colors mr-3 focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933] rounded-md">Buy</button>
                  <button className="text-[#C87933] hover:text-[#D98324] transition-colors mr-3 focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933] rounded-md">Sell</button>
                  <button className="text-[#9BA4B5] hover:text-[#F3ECDC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F3ECDC]/60 focus:ring-offset-1 focus:ring-offset-[#C87933] rounded-md">Watch</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-[#0A0F1C]/80 p-6 rounded-xl border border-[#C87933]/20 relative">
        {/* Inner glow effect at the top */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-[#F3ECDC]/10 rounded-t-xl"></div>
        <div className="absolute inset-x-6 top-0 bottom-0 bg-gradient-to-b from-[#F3ECDC]/5 to-transparent h-8 rounded-t-xl pointer-events-none"></div>
        
        <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">Market Insights</h3>
        <p className="text-[#9BA4B5]">
          Stay updated with the latest market trends and make informed investment decisions.
          Our AI-powered analysis provides real-time insights into market movements.
        </p>
      </div>
    </div>
  );
};

export default Stocks;