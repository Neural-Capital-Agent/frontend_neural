import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InfoTooltip = ({ text }) => (
  <span className="relative group inline-block ml-1 align-middle">
    <span className="text-slate-400 cursor-pointer">ℹ️</span>
    <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block bg-[#181E2C] text-xs text-slate-200 rounded shadow-lg px-3 py-2 w-56">
      {text}
    </span>
  </span>
);

const AccordionSection = ({ icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-[#101624] rounded-xl border border-white/10 shadow-md">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-lg font-semibold text-slate-100">{icon} {title}</span>
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </button>
      <div className={`px-6 pb-6 transition-all duration-300 ${open ? 'block' : 'hidden'}`}>{children}</div>
    </section>
  );
};

const SettingsMarket = () => {
  const [showToast, setShowToast] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [macroData, setMacroData] = useState({
    employment: null,
    inflation: null,
    volatility: null
  });

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all three endpoints in parallel
      const [employmentResponse, inflationResponse, volatilityResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/agents/data/macro/payems'),
        axios.get('http://localhost:8000/api/v1/agents/data/macro/CPIAUCSL'),
        axios.get('http://localhost:8000/api/v1/agents/data/macro/VIXCLS')
      ]);
      
      // Store the raw data from each endpoint
      setMacroData({
        employment: employmentResponse.data,
        inflation: inflationResponse.data,
        volatility: volatilityResponse.data
      });
      
      // Process the data into a format suitable for display
      const processedData = processMacroData(
        employmentResponse.data, 
        inflationResponse.data, 
        volatilityResponse.data
      );
      
      setMarketData(processedData);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Process the data from all three endpoints into a unified format
  const processMacroData = (employment, inflation, volatility) => {
    // Extract the latest values and calculate trends
    const latestEmployment = employment?.observations?.[0]?.value || 'N/A';
    const latestInflation = inflation?.observations?.[0]?.value || 'N/A';
    const latestVolatility = volatility?.observations?.[0]?.value || 'N/A';
    
    // Calculate percentage changes (if we have at least 2 data points)
    const employmentChange = calculateChange(employment?.observations || []);
    const inflationChange = calculateChange(inflation?.observations || []);
    const volatilityChange = calculateChange(volatility?.observations || []);
    
    // Determine market trend based on the data
    const trend = determineTrend(employmentChange, inflationChange, volatilityChange);
    
    return {
      // Overall market status
      volatility: latestVolatility !== 'N/A' ? parseFloat(latestVolatility).toFixed(2) : 'N/A',
      trend: trend,
      riskSentiment: getRiskSentiment(latestVolatility, trend),
      
      // Detailed indicators
      indicators: [
        {
          name: "Employment (Nonfarm Payrolls)",
          value: formatNumber(latestEmployment),
          change: employmentChange,
          status: getStatusFromChange(employmentChange, true) // Employment going up is positive
        },
        {
          name: "Inflation (CPI)",
          value: latestInflation !== 'N/A' ? `${parseFloat(latestInflation).toFixed(1)}%` : 'N/A',
          change: inflationChange,
          status: getStatusFromChange(inflationChange, false) // Inflation going up is generally negative
        },
        {
          name: "Volatility (VIX)",
          value: latestVolatility !== 'N/A' ? parseFloat(latestVolatility).toFixed(2) : 'N/A',
          change: volatilityChange,
          status: getStatusFromChange(volatilityChange, false) // Volatility going up is negative
        }
      ],
      
      // Sample asset class data (in a real app, this would also come from an API)
      assetClasses: [
        {
          name: "US Equities",
          performance: { "1d": 0.3, "1w": 1.2, "1m": -2.4, "ytd": 5.7 }
        },
        {
          name: "US Bonds",
          performance: { "1d": -0.1, "1w": 0.4, "1m": 1.1, "ytd": -1.9 }
        },
        {
          name: "International Equities",
          performance: { "1d": 0.2, "1w": -0.8, "1m": -3.2, "ytd": 3.1 }
        },
        {
          name: "Commodities",
          performance: { "1d": 0.5, "1w": 2.1, "1m": 4.3, "ytd": 9.8 }
        },
        {
          name: "Crypto",
          performance: { "1d": -1.7, "1w": 5.3, "1m": -8.5, "ytd": 22.4 }
        }
      ]
    };
  };
  
  // Helper functions
  const calculateChange = (observations) => {
    if (observations.length < 2) return 0;
    const current = parseFloat(observations[0].value);
    const previous = parseFloat(observations[1].value);
    if (isNaN(current) || isNaN(previous) || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  const determineTrend = (employmentChange, inflationChange, volatilityChange) => {
    // Simple trend determination logic
    const score = (employmentChange > 0 ? 1 : -1) + 
                 (inflationChange < 2 ? 1 : -1) + 
                 (volatilityChange < 0 ? 1 : -1);
    
    if (score >= 2) return "Bullish";
    if (score <= -2) return "Bearish";
    return "Neutral";
  };
  
  const getRiskSentiment = (volatility, trend) => {
    const vix = parseFloat(volatility);
    if (isNaN(vix)) return "Unknown";
    
    if (vix > 30) return "High Risk";
    if (vix > 20) return "Moderate Risk";
    return "Low Risk";
  };
  
  const getStatusFromChange = (change, isPositiveGood) => {
    if (Math.abs(change) < 0.5) return "Neutral";
    return (change > 0) === isPositiveGood ? "Positive" : "Negative";
  };
  
  const formatNumber = (num) => {
    if (num === 'N/A') return 'N/A';
    return new Intl.NumberFormat('en-US').format(parseInt(num));
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-8 space-y-6">
      {/* Toast Banner */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-semibold">
          ✅ Settings updated successfully.
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C87933]"></div>
          <span className="ml-3 text-slate-300">Loading market data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchMarketData} 
            className="mt-2 px-4 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Market Data Display */}
      {!loading && !error && marketData && (
        <>
          {/* ⚡ Market Insights Panel */}
          <div className="mb-4">
            <div className="bg-[#181E2C] border border-[#C87933]/30 rounded-lg p-4 flex items-center gap-3 shadow-sm">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-sm font-semibold text-[#C87933]">Market Insights</p>
                <ul className="text-xs text-slate-300 list-disc ml-4 space-y-1">
                  <li>Current volatility: <span className="text-[#EFB570] font-semibold">{marketData.volatility}</span></li>
                  <li>Market trend: <span className={`font-semibold ${marketData.trend === 'Bullish' ? 'text-green-400' : marketData.trend === 'Bearish' ? 'text-red-400' : 'text-yellow-400'}`}>{marketData.trend}</span></li>
                  <li>Risk sentiment: <span className="text-[#EFB570] font-semibold">{marketData.riskSentiment}</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Market Indicators Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {marketData.indicators.map((indicator, index) => (
              <div key={index} className="bg-[#101624] border border-white/10 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-slate-300 font-medium">{indicator.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    indicator.status === 'Positive' ? 'bg-green-500/20 text-green-400' : 
                    indicator.status === 'Negative' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {indicator.status}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-white">{indicator.value}</p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className={indicator.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {indicator.change >= 0 ? '↑' : '↓'} {Math.abs(indicator.change).toFixed(2)}%
                  </span>
                  <span className="text-slate-400">from previous</span>
                </div>
              </div>
            ))}
          </div>

          {/* Asset Class Performance */}
          <AccordionSection icon="💼" title="Asset Class Performance">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 text-sm font-medium text-slate-400">Asset Class</th>
                    <th className="text-right py-3 text-sm font-medium text-slate-400">1D</th>
                    <th className="text-right py-3 text-sm font-medium text-slate-400">1W</th>
                    <th className="text-right py-3 text-sm font-medium text-slate-400">1M</th>
                    <th className="text-right py-3 text-sm font-medium text-slate-400">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.assetClasses.map((asset, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-[#181E2C]/50">
                      <td className="py-3 text-slate-200">{asset.name}</td>
                      {['1d', '1w', '1m', 'ytd'].map((period, i) => (
                        <td key={i} className="text-right py-3">
                          <span className={asset.performance[period] >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {asset.performance[period] >= 0 ? '+' : ''}{asset.performance[period]}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>

          {/* Accordions for each section */}
          <AccordionSection icon="📊" title="Market Preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Default Exchange / Asset Universe</label>
                <select className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2">
                  <option>NYSE</option>
                  <option>NASDAQ</option>
                  <option>Binance</option>
                  <option>Coinbase</option>
                  <option>London Stock Exchange</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Display Currency</label>
                <select className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>SOL</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked />
                <span className="text-slate-300 text-sm">Equities</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" defaultChecked />
                <span className="text-slate-300 text-sm">Bonds</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
                <span className="text-slate-300 text-sm">Crypto</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
                <span className="text-slate-300 text-sm">Alternatives</span>
              </div>
            </div>
          </AccordionSection>
          <AccordionSection icon="🛡️" title="Portfolio & Risk Settings">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Risk Level</label>
              <input type="range" min="1" max="5" className="w-full accent-[#C87933]" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Max equity % cap
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Min bonds %
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Exclude crypto
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> ESG filter
                <InfoTooltip text="ESG filter restricts portfolio to assets meeting environmental, social, and governance criteria." />
              </label>
            </div>
          </AccordionSection>
          <AccordionSection icon="⚡" title="Rebalancing Behavior">
            <div className="mb-6 flex flex-wrap gap-6 items-center">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Frequency</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="radio" name="freq" className="form-radio text-[#C87933]" defaultChecked /> Daily
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="radio" name="freq" className="form-radio text-[#C87933]" /> Weekly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="radio" name="freq" className="form-radio text-[#C87933]" /> Monthly
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">Drift Threshold <InfoTooltip text="Drift threshold is the % deviation from target allocation that triggers a rebalance." /></label>
                <input type="range" min="1" max="20" className="w-full accent-[#C87933]" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mt-6">Macro Override <InfoTooltip text="Allow macro signals to trigger instant rebalancing, regardless of drift." /></label>
                <input type="checkbox" className="form-checkbox rounded text-[#C87933]" />
              </div>
            </div>
          </AccordionSection>
          <AccordionSection icon="📈" title="Macro-Signal Triggers">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Yield curve inversion','Inflation shock','Volatility spike','Credit stress','PMI contraction','Market momentum'].map((label) => (
                <label key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> {label}
                </label>
              ))}
            </div>
            <div className="mt-6">
              <span className="text-xs text-slate-400">Advanced mode: sensitivity sliders</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {['Yield curve','Inflation','Volatility','Credit','PMI','Momentum'].map((label) => (
                  <div key={label}>
                    <label className="block text-xs text-slate-400 mb-1">{label} sensitivity</label>
                    <input type="range" min="1" max="10" className="w-full accent-[#C87933]" />
                  </div>
                ))}
              </div>
            </div>
          </AccordionSection>
          <AccordionSection icon="🔔" title="Security & Alerts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                  <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> 2FA for trades
                </label>
                <label className="block text-sm font-medium text-slate-400 mb-1">Max trade size (per order / per day)</label>
                <input type="number" className="w-full rounded-lg border border-slate-700 bg-[#181E2C] text-slate-100 px-3 py-2" placeholder="$10,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Notifications</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Price alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Risk alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="form-checkbox rounded text-[#C87933]" /> Portfolio changes
                  </label>
                </div>
              </div>
            </div>
          </AccordionSection>
          
          {/* Save / Reset Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-[#C87933] text-white font-semibold shadow hover:bg-[#D98324] transition">Save Changes</button>
            <button className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-[#181E2C] transition">Reset</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsMarket;