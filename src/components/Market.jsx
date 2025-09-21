import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiConfig.js';

const Market = () => {
  const [marketData, setMarketData] = useState([]);
  const [marketContext, setMarketContext] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

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

  // Use centralized API configuration

  // Mock data fallback
  const getMockData = () => {
    return [
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        category: 'Market',
        price: 440.50,
        previousClose: 438.20,
        change: 2.30,
        changePercent: 0.52,
        volume: 50000000,
        marketCap: 400000000000,
        dayHigh: 441.00,
        dayLow: 439.00,
        yearHigh: 445.00,
        yearLow: 350.00,
        peRatio: 22.5,
        dividendYield: 1.65,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        category: 'Technology',
        price: 380.75,
        previousClose: 378.50,
        change: 2.25,
        changePercent: 0.59,
        volume: 40000000,
        marketCap: 200000000000,
        dayHigh: 382.00,
        dayLow: 379.00,
        yearHigh: 385.00,
        yearLow: 280.00,
        peRatio: 28.3,
        dividendYield: 0.45,
        timestamp: new Date().toISOString()
      }
    ];
  };

  // Test network connectivity
  const testConnectivity = async () => {
    try {
      console.log('Testing connectivity to:', getApiUrl());
      const response = await fetch(`${getApiUrl()}/health`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      console.log('Connectivity test response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Connectivity test failed:', error);
      return false;
    }
  };

  // Debug function to test basic API connectivity
  const debugAPI = async () => {
    const apiUrl = getApiUrl();
    console.log('=== API DEBUG INFO ===');
    console.log('API Base URL:', apiUrl);
    console.log('Environment variables:', {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    });

    // Test simple GET request
    try {
      console.log('Testing simple fetch to ETF endpoint...');
      const response = await fetch(`${apiUrl}/dashboard/etfs`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Response data preview:', {
          status: data.status,
          dataKeys: Object.keys(data.data || {}),
          etfCount: Array.isArray(data.data?.etf_data) ? data.data.etf_data.length : 'Not array'
        });
        return data;
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Debug API test failed:', error);
      throw error;
    }
  };

  const fetchMarketData = async (refresh = false, retryCount = 0) => {
    const maxRetries = 2;

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching market data - refresh: ${refresh}, retry: ${retryCount}`);

      // Test connectivity first on retry attempts
      if (retryCount > 0) {
        const isConnected = await testConnectivity();
        if (!isConnected) {
          throw new Error('Network connectivity test failed');
        }
      }

      // Fetch ETF data from Agent 1 via dashboard endpoint
      const etfResponse = await fetch(
        `${getApiUrl()}/dashboard/etfs?refresh=${refresh}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }
      );

      if (!etfResponse.ok) {
        throw new Error(`ETF data fetch failed: ${etfResponse.status}`);
      }

      const etfResult = await etfResponse.json();
      console.log('ETF response received:', etfResult.status, 'data keys:', Object.keys(etfResult.data || {}));

      // Fetch market overview data
      const overviewResponse = await fetch(
        `${getApiUrl()}/dashboard/market-overview?refresh=${refresh}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(30000)
        }
      );

      if (!overviewResponse.ok) {
        throw new Error(`Market overview fetch failed: ${overviewResponse.status}`);
      }

      const overviewResult = await overviewResponse.json();
      console.log('Market overview received:', overviewResult.status, 'data keys:', Object.keys(overviewResult.data || {}));

      // Process ETF data - handle both array and object formats
      if (etfResult.status === 'success' && etfResult.data) {
        let etfData = etfResult.data.etf_data;

        // Handle nested structure from Agent 1 refresh
        if (!etfData && etfResult.data.data?.etf_data) {
          etfData = etfResult.data.data.etf_data;
        }

        if (etfData) {
          let processedData = [];

          // Handle array format (new database structure)
          if (Array.isArray(etfData)) {
            processedData = etfData.map((data) => ({
              symbol: data.display_symbol || data.symbol,
              name: etfConfig[data.display_symbol || data.symbol]?.name || data.etf_name || data.name || data.symbol,
              category: etfConfig[data.display_symbol || data.symbol]?.category || 'ETF',
              price: data.price || 0,
              previousClose: data.previous_close || 0,
              change: data.change_value || 0,
              changePercent: data.change_percent || 0,
              volume: data.volume || 0,
              marketCap: data.market_cap || 0,
              dayHigh: data.day_high || 0,
              dayLow: data.day_low || 0,
              yearHigh: data.year_high || 0,
              yearLow: data.year_low || 0,
              peRatio: data.pe_ratio || null,
              dividendYield: data.dividend_yield || null,
              timestamp: data.data_timestamp || data.updated_at || new Date().toISOString()
            }));
          }
          // Handle object format (old Agent 1 structure)
          else if (typeof etfData === 'object') {
            processedData = Object.entries(etfData).map(([symbol, data]) => ({
              symbol,
              name: etfConfig[symbol]?.name || data.name || symbol,
              category: etfConfig[symbol]?.category || 'ETF',
              price: data.market_data?.price || data.price || 0,
              previousClose: data.market_data?.previous_close || data.previous_close || 0,
              change: data.market_data?.change || data.change_value || 0,
              changePercent: data.market_data?.change_percent || data.change_percent || 0,
              volume: data.additional_info?.volume || data.volume || 0,
              marketCap: data.additional_info?.market_cap || data.market_cap || 0,
              dayHigh: data.additional_info?.day_high || data.day_high || 0,
              dayLow: data.additional_info?.day_low || data.day_low || 0,
              yearHigh: data.additional_info?.year_high || data.year_high || 0,
              yearLow: data.additional_info?.year_low || data.year_low || 0,
              peRatio: data.additional_info?.pe_ratio || data.pe_ratio || null,
              dividendYield: data.additional_info?.dividend_yield || data.dividend_yield || null,
              timestamp: data.market_data?.timestamp || data.data_timestamp || new Date().toISOString()
            }));
          }

          console.log(`Processed ${processedData.length} ETFs:`, processedData.map(etf => etf.symbol));
          setMarketData(processedData);
        } else {
          console.warn('No ETF data found in response');
        }
      }

      // Process market context
      if (overviewResult.status === 'success' && overviewResult.data) {
        setMarketContext(overviewResult.data);
        console.log('Market context updated with VIX:', overviewResult.data.volatility?.vix);
      } else {
        console.warn('No market overview data found');
      }

      setLastRefresh(new Date());
      console.log('Market data fetch completed successfully');
    } catch (err) {
      console.error(`Error fetching market data (attempt ${retryCount + 1}):`, err);

      // Retry logic for network errors
      if (retryCount < maxRetries && (
        err.name === 'TypeError' ||
        err.message.includes('Failed to fetch') ||
        err.message.includes('timeout') ||
        err.message.includes('AbortError')
      )) {
        console.log(`Retrying in 2 seconds... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          fetchMarketData(refresh, retryCount + 1);
        }, 2000);
        return;
      }

      // Provide more specific error messages
      let errorMessage = 'Failed to fetch market data';
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection or try again later.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: Cross-origin request blocked. Please check server configuration.';
      } else if (err.message.includes('timeout') || err.name === 'AbortError') {
        errorMessage = 'Request timeout: Server is taking too long to respond. Please try again.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'Network error: Please check your internet connection.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }

      // After all retries failed, offer to use mock data
      console.log('All API attempts failed, offering mock data fallback...');
      setError(`${errorMessage} - Using demo data instead.`);
      setMarketData(getMockData());
      setIsUsingMockData(true);
      setLastRefresh(new Date());
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Agent 1 execution via refresh endpoint
      const refreshResponse = await fetch(
        `${getApiUrl()}/dashboard/refresh`,
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
      console.log('Agent 1 refresh response:', refreshResult.status);

      if (refreshResult.status !== 'success') {
        throw new Error(refreshResult.message || 'Agent 1 refresh failed');
      }

      // The refresh endpoint already returns the updated data, so let's use it
      if (refreshResult.data?.data?.etf_data) {
        console.log('Using fresh data from refresh response');

        // Process the fresh ETF data from the refresh response - handle object format from Agent 1
        const processedData = Object.entries(refreshResult.data.data.etf_data).map(([symbol, data]) => ({
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
        console.log(`Refresh: Processed ${processedData.length} ETFs from Agent 1`);

        // Also fetch market overview to update context
        try {
          const overviewResponse = await fetch(`${getApiUrl()}/dashboard/market-overview?refresh=false`);
          if (overviewResponse.ok) {
            const overviewResult = await overviewResponse.json();
            if (overviewResult.status === 'success' && overviewResult.data) {
              setMarketContext(overviewResult.data);
            }
          }
        } catch (overviewError) {
          console.warn('Failed to update market context after refresh:', overviewError);
        }

        setLastRefresh(new Date());
        setLoading(false);
      } else {
        // Fallback: fetch from database if refresh doesn't return data
        console.log('Refresh response missing data, fetching from database');
        await fetchMarketData(false);
      }

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
            {isUsingMockData ? (
              <span className="text-orange-600 font-medium">⚠️ Using demo data (API connection failed)</span>
            ) : (
              "Real-time data from Agent 1 (Data Agent) • Click \"Run Agent 1\" to fetch fresh data"
            )}
            {lastRefresh && (
              <span className="ml-2">
                • Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              try {
                setError(null);
                const data = await debugAPI();
                console.log('Debug test successful:', data);
                alert('API test successful! Check console for details.');
              } catch (error) {
                console.error('Debug test failed:', error);
                alert(`API test failed: ${error.message}`);
              }
            }}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            Debug API
          </button>
          <button
            onClick={() => {
              setIsUsingMockData(false);
              setError(null);
              fetchMarketData(false);
            }}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            {isUsingMockData ? 'Retry API' : 'Reload Data'}
          </button>
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

      {marketData.length === 0 && !loading && !isUsingMockData && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No market data available</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => {
                setError(null);
                fetchMarketData(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setMarketData(getMockData());
                setIsUsingMockData(true);
                setLastRefresh(new Date());
                setError('Using demo data for preview');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Use Demo Data
            </button>
          </div>
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