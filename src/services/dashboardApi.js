// Dashboard API Service for Neural Capital ETF Data
const API_BASE_URL = `${(import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000'}/api/v1`;

class DashboardApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Dashboard API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ETF Data Methods
  etfs = {
    // Get all dashboard ETFs
    getAll: (refresh = false) =>
      this.makeRequest(`/dashboard/etfs?refresh=${refresh}`),

    // Get specific ETF
    getOne: (symbol, refresh = false) =>
      this.makeRequest(`/dashboard/etfs/${symbol}?refresh=${refresh}`),

    // Get technical indicators for ETF
    getTechnicalIndicators: (symbol, period = '1y') =>
      this.makeRequest(`/dashboard/technical-indicators/${symbol}?period=${period}`),
  };

  // Market Overview Methods
  market = {
    // Get market overview (VIX, yields, etc.)
    getOverview: (refresh = false) =>
      this.makeRequest(`/dashboard/market-overview?refresh=${refresh}`),

    // Get complete dashboard data
    getDashboardData: (userId = null, refresh = false) => {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (refresh) params.append('refresh', 'true');

      return this.makeRequest(`/dashboard/?${params.toString()}`);
    },

    // Refresh all dashboard data
    refreshData: () =>
      this.makeRequest('/dashboard/refresh', { method: 'POST' }),
  };

  // User Watchlist Methods
  watchlist = {
    // Save user watchlist
    save: (userId, symbols) =>
      this.makeRequest(`/dashboard/watchlist/${userId}`, {
        method: 'POST',
        body: JSON.stringify(symbols),
      }),
  };

  // Utility method to format ETF data for display
  formatETFData(etfData) {
    const formatted = [];

    if (etfData?.data?.etf_data) {
      // Handle fresh data format
      Object.entries(etfData.data.etf_data).forEach(([symbol, data]) => {
        formatted.push({
          symbol: symbol,
          name: data.name,
          price: data.market_data?.price || 0,
          previousClose: data.market_data?.previous_close || 0,
          change: data.market_data?.change || 0,
          changePercent: data.market_data?.change_percent || 0,
          volume: data.additional_info?.volume,
          marketCap: data.additional_info?.market_cap,
          peRatio: data.additional_info?.pe_ratio,
          dividendYield: data.additional_info?.dividend_yield,
          dayHigh: data.additional_info?.day_high,
          dayLow: data.additional_info?.day_low,
          yearHigh: data.additional_info?.year_high,
          yearLow: data.additional_info?.year_low,
          timestamp: data.market_data?.timestamp,
        });
      });
    } else if (etfData?.data?.etf_data && Array.isArray(etfData.data.etf_data)) {
      // Handle simplified database format (single table)
      etfData.data.etf_data.forEach(item => {
        formatted.push({
          symbol: item.display_symbol || item.symbol,
          name: item.etf_name || item.name,
          price: parseFloat(item.price) || 0,
          previousClose: parseFloat(item.previous_close) || 0,
          change: parseFloat(item.change_value) || 0,
          changePercent: parseFloat(item.change_percent) || 0,
          volume: item.volume,
          marketCap: item.market_cap,
          peRatio: item.pe_ratio,
          dividendYield: item.dividend_yield,
          dayHigh: item.day_high,
          dayLow: item.day_low,
          yearHigh: item.year_high,
          yearLow: item.year_low,
          beta: item.beta,
          expenseRatio: item.expense_ratio,
          totalAssets: item.total_assets,
          sma20: item.sma_20,
          sma50: item.sma_50,
          sma200: item.sma_200,
          rsi: item.rsi,
          timestamp: item.data_timestamp || item.updated_at,
        });
      });
    }

    return formatted;
  }

  // Format market overview data
  formatMarketOverview(marketData) {
    const overview = {
      vix: null,
      vixChange: null,
      treasuryYields: {},
      marketRegime: 'unknown',
      lastUpdate: null,
    };

    if (marketData?.data) {
      // Handle fresh data format
      if (marketData.data.volatility) {
        overview.vix = marketData.data.volatility.vix;
        overview.vixChange = marketData.data.volatility.vix_change;
        overview.marketRegime = marketData.data.market_regime || marketData.data.volatility.market_regime || 'unknown';
      }

      // Handle treasury yields
      if (marketData.data.treasury_yields) {
        overview.treasuryYields = {
          twoYear: marketData.data.treasury_yields['2y_yield'],
          tenYear: marketData.data.treasury_yields['10y_yield'],
          spread: marketData.data.treasury_yields['2s_10s_spread'],
        };
      }

      overview.lastUpdate = marketData.timestamp;
    }

    return overview;
  }

  // Get formatted dashboard summary
  async getDashboardSummary(userId = null, refresh = false) {
    try {
      const [etfData, marketOverview] = await Promise.all([
        this.etfs.getAll(refresh),
        this.market.getOverview(refresh),
      ]);

      return {
        etfs: this.formatETFData(etfData),
        market: this.formatMarketOverview(marketOverview),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  // Real-time data update method
  async startRealTimeUpdates(callback, interval = 60000) {
    const updateData = async () => {
      try {
        const summary = await this.getDashboardSummary(null, true);
        callback(summary);
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    };

    // Initial load
    await updateData();

    // Set up interval
    const intervalId = setInterval(updateData, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

export default new DashboardApiService();