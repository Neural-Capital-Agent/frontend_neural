import React, { useState, useEffect } from 'react';

const Market = () => {
  const [marketData, setMarketData] = useState([]);
  const [marketContext, setMarketContext] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // ETF display configuration matching Agent 1 output
  const etfConfig = {
    'QQQ': { name: 'Invesco QQQ Trust', category: 'Technology' },
    'SPY': { name: 'SPDR S&P 500 ETF', category: 'Market' },
    'VXUS': { name: 'Vanguard Total International Stock ETF', category: 'International' },
    'IEF': { name: 'iShares 7-10 Year Treasury Bond ETF', category: 'Bonds' },
    'BND': { name: 'Vanguard Total Bond Market ETF', category: 'Bonds' },
    'SHY': { name: 'iShares 1-3 Year Treasury Bond ETF', category: 'Bonds' },
    'ETH': { name: 'Grayscale Ethereum Mini Trust ETF', category: 'Crypto' },
    'BTC': { name: 'ProShares Bitcoin Strategy ETF', category: 'Crypto' }
  };

  // API configuration - adjust URL as needed
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const fetchMarketData = async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ETF data from Agent 1 via dashboard endpoint
      const etfResponse = await fetch(
        `${API_BASE_URL}/api/v1/dashboard/etfs?refresh=${refresh}`
      );

      if (!etfResponse.ok) {
        throw new Error(`ETF data fetch failed: ${etfResponse.status}`);
      }

      const etfResult = await etfResponse.json();

      // Fetch market overview data
      const overviewResponse = await fetch(
        `${API_BASE_URL}/api/v1/dashboard/market-overview?refresh=${refresh}`
      );

      if (!overviewResponse.ok) {
        throw new Error(`Market overview fetch failed: ${overviewResponse.status}`);
      }

      const overviewResult = await overviewResponse.json();

      // Process ETF data
      if (etfResult.status === 'success' && etfResult.data?.etf_data) {
        const processedData = Object.entries(etfResult.data.etf_data).map(([symbol, data]) => ({
          symbol,
          name: etfConfig[symbol]?.name || data.name || symbol,
          category: etfConfig[symbol]?.category || 'ETF',
          price: data.market_data?.price || 0,
          previousClose: data.market_data?.previous_close || 0,
          change: data.market_data?.change || 0,
          changePercent: data.market_data?.change_percent || 0,
          volume: data.additional_info?.volume || 0,
          marketCap: data.additional_info?.market_cap || 0,
          dayHigh: data.additional_info?.day_high || 0,
          dayLow: data.additional_info?.day_low || 0,
          yearHigh: data.additional_info?.year_high || 0,
          yearLow: data.additional_info?.year_low || 0,
          peRatio: data.additional_info?.pe_ratio || null,
          dividendYield: data.additional_info?.dividend_yield || null,
          timestamp: data.market_data?.timestamp || new Date().toISOString()
        }));
        setMarketData(processedData);
      }

      // Process market context
      if (overviewResult.status === 'success' && overviewResult.data) {
        setMarketContext(overviewResult.data);
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Agent 1 execution via refresh endpoint
      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/v1/dashboard/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!refreshResponse.ok) {
        throw new Error(`Agent 1 refresh failed: ${refreshResponse.status}`);
      }

      const refreshResult = await refreshResponse.json();

      if (refreshResult.status !== 'success') {
        throw new Error(refreshResult.message || 'Agent 1 refresh failed');
      }

      // Now fetch the updated data from database
      await fetchMarketData(false);

    } catch (err) {
      console.error('Error running Agent 1:', err);
      setError(`Agent 1 execution failed: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(false); // Initial load from database

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchMarketData(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num, decimals = 2) => {
    if (!num || isNaN(num)) return '0.00';
    return parseFloat(num).toFixed(decimals);
  };

  const formatLargeNumber = (num) => {
    if (!num || isNaN(num)) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Market': 'bg-green-100 text-green-800',
      'International': 'bg-purple-100 text-purple-800',
      'Bonds': 'bg-yellow-100 text-yellow-800',
      'Crypto': 'bg-orange-100 text-orange-800',
      'ETF': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['ETF'];
  };

  if (loading && marketData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 my-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 my-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Market Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time data from Agent 1 (Data Agent) • Click "Run Agent 1" to fetch fresh data
            {lastRefresh && (
              <span className="ml-2">
                • Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Agent 1...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run Agent 1
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Market Context Cards */}
      {marketContext && Object.keys(marketContext).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {marketContext.volatility && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">VIX</h3>
              <p className="text-2xl font-bold text-red-900">
                {formatNumber(marketContext.volatility.vix)}
              </p>
              <p className={`text-sm font-medium ${
                marketContext.volatility.vix_change >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {marketContext.volatility.vix_change >= 0 ? '▲' : '▼'}
                {formatNumber(Math.abs(marketContext.volatility.vix_change_percent))}%
              </p>
            </div>
          )}

          {marketContext.treasury_yields && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">10Y Treasury</h3>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(marketContext.treasury_yields['10y_yield'])}%
              </p>
              <p className="text-sm text-blue-700">
                2s-10s Spread: {formatNumber(marketContext.treasury_yields['2s_10s_spread'])}%
              </p>
            </div>
          )}

          {marketContext.market_regime && (
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Market Regime</h3>
              <p className="text-lg font-medium text-purple-900 capitalize">
                {marketContext.market_regime.replace(/_/g, ' ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ETF Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.map((etf) => (
          <div key={etf.symbol} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{etf.symbol}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(etf.category)}`}>
                    {etf.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{etf.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ${formatNumber(etf.price)}
                </span>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    etf.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {etf.change >= 0 ? '+' : ''}${formatNumber(etf.change)}
                  </p>
                  <p className={`text-sm font-medium ${
                    etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {etf.changePercent >= 0 ? '▲' : '▼'} {formatNumber(Math.abs(etf.changePercent))}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">High</p>
                  <p className="font-medium">${formatNumber(etf.dayHigh)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Low</p>
                  <p className="font-medium">${formatNumber(etf.dayLow)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Volume</p>
                  <p className="font-medium">{formatLargeNumber(etf.volume)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mkt Cap</p>
                  <p className="font-medium">{formatLargeNumber(etf.marketCap)}</p>
                </div>
              </div>

              {(etf.peRatio || etf.dividendYield) && (
                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-3 text-sm">
                  {etf.peRatio && (
                    <div>
                      <p className="text-gray-500">P/E Ratio</p>
                      <p className="font-medium">{formatNumber(etf.peRatio)}</p>
                    </div>
                  )}
                  {etf.dividendYield && (
                    <div>
                      <p className="text-gray-500">Div Yield</p>
                      <p className="font-medium">{formatNumber(etf.dividendYield * 100)}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {marketData.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No market data available</p>
          <button
            onClick={refreshData}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Fetch Data
          </button>
        </div>
      )}

      <div className="mt-8 bg-indigo-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-indigo-800 mb-2">Agent 1 - Data Agent</h3>
        <p className="text-indigo-600 text-sm">
          This market data is collected and processed by Agent 1 (Data Agent) in real-time.
          Click "Run Agent 1" to execute the agent and fetch fresh market data from Yahoo Finance,
          FRED, and other sources. The data is automatically saved to the dashboard_market_data table
          in Supabase for other agents to use.
        </p>
      </div>
    </div>
  );
};

export default Market;