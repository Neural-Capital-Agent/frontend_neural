import React, { useState, useEffect } from 'react';

const MacroInfo = () => {
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // In Vite, env vars are exposed via import.meta.env and must be prefixed with VITE_
  const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000';

  // Normalize backend economy response (FRED series) into our indicator keys
  const normalizeEconomyToIndicators = (economyData) => {
    try {
      if (!economyData || typeof economyData !== 'object') return null;

      // economyData uses FRED series IDs as keys (e.g., CPIAUCSL, FEDFUNDS, DGS10, DGS2)
      const makeSeries = (seriesKey) => {
        const observations = economyData[seriesKey];
        if (!Array.isArray(observations)) return [];
        // Map newest first and cast values
        const mapped = observations
          .map((o) => ({
            date: o.date || o.observation_date,
            value: isNaN(parseFloat(o.value)) ? null : parseFloat(o.value),
          }))
          .filter((d) => d.value !== null);
        // Ensure we have at least one data point
        if (mapped.length === 0) return [];
        // latest first
        return mapped.reverse();
      };

      const normalized = {};
      // Map CPI to INFLATION
      if (Array.isArray(economyData.CPIAUCSL)) {
        const s = makeSeries('CPIAUCSL');
        if (s.length > 0) normalized.INFLATION = s;
      }
      // Map Fed Funds Rate
      if (Array.isArray(economyData.FEDFUNDS)) {
        const s = makeSeries('FEDFUNDS');
        if (s.length > 0) normalized.INTEREST_RATES = s;
      }
      // If available, map unemployment and GDP from standard FRED IDs
      if (Array.isArray(economyData.UNRATE)) {
        const s = makeSeries('UNRATE');
        if (s.length > 0) normalized.UNEMPLOYMENT = s;
      }
      if (Array.isArray(economyData.GDP)) {
        const s = makeSeries('GDP');
        if (s.length > 0) normalized.GDP = s;
      }

      return Object.keys(normalized).length ? normalized : null;
    } catch (_) {
      return null;
    }
  };

  // Macro indicator configurations
  const indicatorConfig = {
    GDP: {
      name: 'Gross Domestic Product',
      unit: 'Billions USD',
      color: 'blue',
      icon: 'chart-bar',
      description: 'Total value of goods and services produced'
    },
    INFLATION: {
      name: 'Consumer Price Index',
      unit: 'Index Value',
      color: 'red',
      icon: 'trending-up',
      description: 'Measure of average change in prices'
    },
    UNEMPLOYMENT: {
      name: 'Unemployment Rate',
      unit: 'Percentage',
      color: 'orange',
      icon: 'users',
      description: 'Percentage of labor force unemployed'
    },
    INTEREST_RATES: {
      name: 'Federal Funds Rate',
      unit: 'Percentage',
      color: 'green',
      icon: 'percentage',
      description: 'Federal Reserve benchmark interest rate'
    }
  };

  const fetchMacroData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple endpoints to get macro data
      let data = null;

      // First try the economy endpoint for bundled data
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/economy/`);
        if (response.ok) {
          const economyRaw = await response.json();
          // The endpoint returns raw FRED series keyed by series id
          const normalized = normalizeEconomyToIndicators(economyRaw);
          if (normalized) data = normalized;
        }
      } catch (economyError) {
        console.warn('Economy endpoint failed:', economyError);
      }

      // If economy endpoint fails, try individual macro indicators
      if (!data) {
        try {
          const indicators = ['GDP', 'INFLATION', 'UNEMPLOYMENT', 'INTEREST_RATES'];
          const requests = indicators.map(indicator =>
            // Note: legacy endpoints may not exist; ignore failures gracefully
            fetch(`${API_BASE_URL}/api/v1/agents/data/macro/${indicator}?date_range=100`)
              .then(res => res.ok ? res.json() : null)
              .then(result => ({ indicator, data: result?.data || [] }))
              .catch(() => ({ indicator, data: [] }))
          );

          const results = await Promise.all(requests);
          data = {};
          results.forEach(({ indicator, data: indicatorData }) => {
            data[indicator] = indicatorData;
          });
        } catch (agentError) {
          console.warn('Agent data endpoints failed:', agentError);
        }
      }

      // If still no data, try loading from static file as fallback
      if (!data || Object.keys(data).length === 0) {
        try {
          // Load the static macro data that we know exists
          const response = await fetch('/temp_storage/macro_data.json');
          if (response.ok) {
            const staticData = await response.json();
            data = staticData.indicators;
          }
        } catch (staticError) {
          console.warn('Static data fallback failed:', staticError);
        }
      }

      if (data && Object.keys(data).length > 0) {
        setMacroData(data);
        setLastRefresh(new Date());
      } else {
        throw new Error('No macro data available from any source');
      }
    } catch (err) {
      console.error('Error fetching macro data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshMacroData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger Agent 1 to refresh macro data
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

      // Now fetch the updated data
      await fetchMacroData();
    } catch (err) {
      console.error('Error refreshing macro data:', err);
      setError(`Refresh failed: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMacroData();

    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchMacroData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num, decimals = 2) => {
    if (!num || isNaN(num)) return '0.00';
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const formatLargeNumber = (num) => {
    if (!num || isNaN(num)) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const getChangeColor = (current, previous) => {
    if (!current || !previous) return 'text-gray-500';
    const change = current - previous;
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeArrow = (current, previous) => {
    if (!current || !previous) return '—';
    const change = current - previous;
    return change >= 0 ? '▲' : '▼';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        badge: 'bg-blue-100 text-blue-800',
        icon: 'text-blue-600'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-800',
        icon: 'text-red-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-800',
        icon: 'text-orange-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-800',
        icon: 'text-green-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const getIcon = (iconType) => {
    const icons = {
      'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
      'percentage': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    };
    return icons[iconType] || icons['chart-bar'];
  };

  if (loading && !macroData) {
    return (
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[#232736] rounded-md mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#232736] rounded-xl p-6">
                <div className="h-6 bg-[#3D4252] rounded mb-4"></div>
                <div className="h-8 bg-[#3D4252] rounded mb-2"></div>
                <div className="h-4 bg-[#3D4252] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D29] rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#232736] p-6 border-b border-[#3D4252]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Macroeconomic Indicators</h2>
            <p className="text-slate-300 mt-1">
              Real-time economic data from Agent 1 (Data Agent) via FRED API
              {lastRefresh && (
                <span className="ml-2">
                  • Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={refreshMacroData}
            disabled={loading}
            className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 disabled:bg-[#F59E0B]/50 text-black px-4 py-2 rounded-lg transition-colors flex items-center font-medium"
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
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {macroData ? (
          <div className="space-y-6">
            {/* Indicator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(macroData).map(([key, values]) => {
                if (!values || !Array.isArray(values) || values.length === 0) return null;

                const config = indicatorConfig[key];
                if (!config) return null;

                const colors = getColorClasses(config.color);
                const latest = values[0];
                const previous = values[1];

                let displayValue;
                let unit = config.unit;

                if (key === 'GDP') {
                  displayValue = formatLargeNumber(latest.value * 1000000); // Convert to actual billions
                  unit = '';
                } else if (key === 'INFLATION') {
                  displayValue = formatNumber(latest.value, 1);
                } else {
                  displayValue = formatNumber(latest.value, 1);
                  if (key === 'UNEMPLOYMENT' || key === 'INTEREST_RATES') {
                    unit = '%';
                  }
                }

                return (
                  <div key={key} className={`bg-[#232736] rounded-xl p-6 border ${colors.border} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${colors.badge} rounded-lg flex items-center justify-center`}>
                        <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(config.icon)} />
                        </svg>
                      </div>
                      <span className={`px-2 py-1 ${colors.badge} rounded-full text-xs font-medium`}>
                        {key}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{config.name}</h3>
                        <p className="text-slate-400 text-sm">{config.description}</p>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            {displayValue}
                            <span className="text-lg text-slate-400 ml-1">{unit}</span>
                          </p>
                          {previous && (
                            <p className={`text-sm font-medium ${getChangeColor(latest.value, previous.value)}`}>
                              {getChangeArrow(latest.value, previous.value)}
                              {formatNumber(Math.abs(((latest.value - previous.value) / previous.value) * 100), 2)}%
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#3D4252] pt-3">
                        <p className="text-xs text-slate-500">
                          As of {new Date(latest.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Data points: {values.length}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data Source Info */}
            <div className="bg-[#232736] rounded-xl p-6 border border-[#3D4252]">
              <h3 className="text-xl font-semibold text-white mb-4">About This Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-[#F59E0B] font-medium mb-2">Data Sources</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Federal Reserve Economic Data (FRED)</li>
                    <li>• Bureau of Economic Analysis (BEA)</li>
                    <li>• Bureau of Labor Statistics (BLS)</li>
                    <li>• Federal Reserve Board</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#F59E0B] font-medium mb-2">Update Frequency</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• GDP: Quarterly</li>
                    <li>• CPI: Monthly</li>
                    <li>• Unemployment: Monthly</li>
                    <li>• Fed Funds Rate: As needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-gradient-to-r from-[#F59E0B]/10 to-transparent p-6 rounded-xl border-l-4 border-[#F59E0B]">
              <h3 className="text-xl font-semibold text-white mb-2">Agent 1 - Data Agent</h3>
              <p className="text-slate-300 text-sm">
                This macroeconomic data is collected and processed by Agent 1 (Data Agent) from official government sources.
                The agent automatically fetches the latest available data and stores it for analysis by other agents in the system.
                Click "Refresh Data" to trigger Agent 1 and fetch the most recent economic indicators.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#3D4252] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg mb-4">No macroeconomic data available</p>
            <button
              onClick={refreshMacroData}
              className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Fetch Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroInfo;