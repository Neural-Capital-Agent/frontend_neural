import React, { useState } from "react";
import { useDashboardData, useMarketOverview } from '../hooks/useDashboard';

const Stocks = () => {
  const [showFullData, setShowFullData] = useState(false);

  // Use dashboard hooks for real data
  const {
    etfs,
    loading,
    error,
    isRefreshing,
    refreshData,
    lastUpdate
  } = useDashboardData(false, 60000);

  const {
    data: marketOverview,
    loading: marketLoading
  } = useMarketOverview(false);

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-8 mx-4 my-6 relative">
      {/* Inner glow effect at the top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-[#F3ECDC]/10 rounded-t-xl"></div>
      <div className="absolute inset-x-6 top-0 bottom-0 bg-gradient-to-b from-[#F3ECDC]/5 to-transparent h-12 rounded-t-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#F3ECDC] tracking-wide">Neural Capital ETFs</h2>
          {lastUpdate && (
            <p className="text-xs text-[#9BA4B5] mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-3 py-1 rounded-md text-xs border transition-colors ${
              isRefreshing
                ? 'bg-[#C87933]/20 border-[#C87933]/30 text-[#C87933]/60 cursor-not-allowed'
                : 'bg-[#C87933]/10 border-[#C87933]/30 text-[#F3ECDC] hover:bg-[#C87933]/20'
            }`}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </span>
          </button>
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-md text-xs text-green-400">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Live Data
            </span>
          </div>
        </div>
      </div>
      
      {/* Market Overview Summary */}
      {!marketLoading && marketOverview && (
        <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketOverview.vix && (
              <div className="text-center">
                <div className="text-xs text-[#9BA4B5] uppercase tracking-wider">VIX</div>
                <div className={`text-lg font-semibold ${
                  marketOverview.vix > 25 ? 'text-red-400' : marketOverview.vix > 20 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {marketOverview.vix.toFixed(2)}
                </div>
                {marketOverview.vixChange && (
                  <div className={`text-xs ${marketOverview.vixChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {marketOverview.vixChange >= 0 ? '+' : ''}{marketOverview.vixChange.toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {marketOverview.treasuryYields?.spread && (
              <div className="text-center">
                <div className="text-xs text-[#9BA4B5] uppercase tracking-wider">2s-10s Spread</div>
                <div className={`text-lg font-semibold ${
                  marketOverview.treasuryYields.spread < 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {marketOverview.treasuryYields.spread.toFixed(2)}%
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-xs text-[#9BA4B5] uppercase tracking-wider">Market Regime</div>
              <div className="text-sm font-medium text-[#F3ECDC] capitalize">
                {marketOverview.marketRegime?.replace(/_/g, ' ') || 'Normal'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Refresh Info */}
      <div className="bg-[#111726]/95 border border-[#C87933]/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-[#F3ECDC]">
              ETF data updates manually via refresh button. Click "Refresh Data" to get latest prices from Yahoo Finance.
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-200">Error loading market data: {error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2 text-[#C87933]">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading ETF data...</span>
          </div>
        </div>
      )}
      
      {/* ETF Data Table */}
      {!loading && etfs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#C87933]/20">
            <thead className="bg-[#0A0F1C]/80">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                  ETF Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                  Volume
                </th>
                {showFullData && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9BA4B5] uppercase tracking-wider">
                    Market Cap
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C87933]/20">
              {etfs.map((etf) => (
                <tr key={etf.symbol} className="hover:bg-[#0A0F1C]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold text-[#C87933]">{etf.symbol}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#F3ECDC]">{etf.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#F3ECDC]">
                      ${etf.price > 0 ? etf.price.toFixed(2) : 'N/A'}
                    </div>
                    {etf.previousClose > 0 && (
                      <div className="text-xs text-[#9BA4B5]">
                        Prev: ${etf.previousClose.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.change !== 0 || etf.changePercent !== 0 ? (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        etf.change >= 0
                          ? 'bg-[#163832] text-[#4ade80]'
                          : 'bg-[#3b1c26] text-[#f87171]'
                      }`}>
                        {etf.change >= 0 ? '▲' : '▼'} {Math.abs(etf.change).toFixed(2)} ({Math.abs(etf.changePercent).toFixed(2)}%)
                      </div>
                    ) : (
                      <span className="text-xs text-[#9BA4B5]">No change data</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#F3ECDC]">
                      {etf.volume ? etf.volume.toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  {showFullData && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#F3ECDC]">
                        {etf.marketCap ? `$${(etf.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Toggle Full Data Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowFullData(!showFullData)}
              className="px-4 py-2 bg-[#C87933]/10 border border-[#C87933]/30 text-[#F3ECDC] rounded-lg hover:bg-[#C87933]/20 transition-colors text-sm"
            >
              {showFullData ? 'Show Less' : 'Show More Details'}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && etfs.length === 0 && !error && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9BA4B5] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-[#9BA4B5]">No ETF data available. Try refreshing the data.</p>
        </div>
      )}
      
      <div className="mt-8 bg-[#0A0F1C]/80 p-6 rounded-xl border border-[#C87933]/20 relative">
        {/* Inner glow effect at the top */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-[#F3ECDC]/10 rounded-t-xl"></div>
        <div className="absolute inset-x-6 top-0 bottom-0 bg-gradient-to-b from-[#F3ECDC]/5 to-transparent h-8 rounded-t-xl pointer-events-none"></div>

        <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">Neural Capital ETF Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-[#C87933] mb-2">Portfolio Composition</h4>
            <p className="text-[#9BA4B5] text-sm mb-4">
              Our curated ETF selection provides diversified exposure across equities, bonds, and digital assets.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#F3ECDC]">Equity ETFs</span>
                <span className="text-[#9BA4B5]">QQQ, SPY, VXUS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#F3ECDC]">Fixed Income</span>
                <span className="text-[#9BA4B5]">IEF, BND, SHY</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#F3ECDC]">Digital Assets</span>
                <span className="text-[#9BA4B5]">ETH, BTC ETFs</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#C87933] mb-2">Live Market Data</h4>
            <p className="text-[#9BA4B5] text-sm mb-4">
              Real-time pricing data powered by our Data Agent with automatic updates and market regime detection.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#111726]/50 rounded-lg">
                <div className="text-lg font-semibold text-[#F3ECDC]">{etfs.length}</div>
                <div className="text-xs text-[#9BA4B5]">ETFs Tracked</div>
              </div>
              <div className="text-center p-3 bg-[#111726]/50 rounded-lg">
                <div className="text-lg font-semibold text-[#F3ECDC]">
                  {lastUpdate ? 'Live' : 'Loading'}
                </div>
                <div className="text-xs text-[#9BA4B5]">Data Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;