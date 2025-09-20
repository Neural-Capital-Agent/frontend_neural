import React, { useState } from 'react';
import { useCrewAI, useDataAgent } from '../hooks/useAgents';

const AIMarketAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({
    symbols: '',
    analysisType: 'comprehensive',
    timeframe: '1mo'
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const crewAI = useCrewAI();
  const dataAgent = useDataAgent();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const symbols = analysisData.symbols.split(',').map(s => s.trim().toUpperCase()).filter(s => s);

      if (symbols.length === 0) {
        setError('Please enter at least one stock symbol');
        return;
      }

      const marketAnalysisData = {
        symbols: symbols,
        analysis_type: analysisData.analysisType,
        timeframe: analysisData.timeframe,
        user_id: localStorage.getItem('userId')
      };

      const result = await crewAI.marketAnalysis(marketAnalysisData);
      setResponse(result);
    } catch (err) {
      console.error('Market analysis error:', err);
      setError(err.message || 'Failed to perform market analysis. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderMarketAnalysis = (data) => {
    if (!data) {
      return <p className="text-[#9BA4B5]">No analysis available</p>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#C87933]/20 to-transparent p-4 rounded-lg border-l-4 border-[#C87933]">
          <h3 className="text-xl font-bold text-[#F3ECDC] mb-2">AI Market Analysis Report</h3>
          <p className="text-[#9BA4B5] text-sm">Advanced AI-powered market insights and trends</p>
        </div>

        {data.analysis && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Market Analysis</h4>
            <div className="prose prose-invert max-w-none">
              <div className="text-[#F3ECDC] whitespace-pre-line leading-relaxed">
                {typeof data.analysis === 'string' ? data.analysis : JSON.stringify(data.analysis, null, 2)}
              </div>
            </div>
          </div>
        )}

        {data.technical_indicators && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Technical Indicators</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.technical_indicators).map(([indicator, value]) => (
                <div key={indicator} className="bg-[#111726] rounded-lg p-4">
                  <h5 className="text-[#C87933] font-medium mb-1 capitalize">
                    {indicator.replace('_', ' ')}
                  </h5>
                  <p className="text-[#F3ECDC] text-lg font-bold">
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.recommendations && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">AI Recommendations</h4>
            <div className="space-y-3">
              {Array.isArray(data.recommendations) ? (
                data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-[#111726] rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-[#C87933] mt-2"></div>
                    <p className="text-[#F3ECDC]">{rec}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#F3ECDC]">{data.recommendations}</p>
              )}
            </div>
          </div>
        )}

        {data.risk_assessment && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Risk Assessment</h4>
            <div className="space-y-4">
              {Object.entries(data.risk_assessment).map(([risk, level]) => (
                <div key={risk} className="flex items-center justify-between p-3 bg-[#111726] rounded-lg">
                  <span className="text-[#F3ECDC] capitalize">{risk.replace('_', ' ')}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    level === 'Low' ? 'bg-green-900 text-green-200' :
                    level === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-red-900 text-red-200'
                  }`}>
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.market_sentiment && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Market Sentiment</h4>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                data.market_sentiment === 'Bullish' ? 'text-green-400' :
                data.market_sentiment === 'Bearish' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {data.market_sentiment}
              </div>
              <p className="text-[#9BA4B5]">Overall market sentiment based on AI analysis</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#F3ECDC] mb-2">AI Market Analysis</h2>
          <p className="text-[#9BA4B5]">Advanced market analysis powered by artificial intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
              Stock Symbols
            </label>
            <input
              type="text"
              value={analysisData.symbols}
              onChange={(e) => handleInputChange('symbols', e.target.value)}
              className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              placeholder="Enter stock symbols separated by commas (e.g., AAPL, MSFT, GOOGL)"
              required
            />
            <p className="text-[#9BA4B5] text-xs mt-1">Separate multiple symbols with commas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Analysis Type
              </label>
              <select
                value={analysisData.analysisType}
                onChange={(e) => handleInputChange('analysisType', e.target.value)}
                className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              >
                <option value="comprehensive">Comprehensive Analysis</option>
                <option value="technical">Technical Analysis</option>
                <option value="fundamental">Fundamental Analysis</option>
                <option value="sentiment">Sentiment Analysis</option>
                <option value="risk">Risk Analysis</option>
              </select>
            </div>

            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Timeframe
              </label>
              <select
                value={analysisData.timeframe}
                onChange={(e) => handleInputChange('timeframe', e.target.value)}
                className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              >
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
                <option value="1mo">1 Month</option>
                <option value="3mo">3 Months</option>
                <option value="6mo">6 Months</option>
                <option value="1y">1 Year</option>
                <option value="2y">2 Years</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={crewAI.loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              crewAI.loading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC]'
            }`}
          >
            {crewAI.loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Market...
              </span>
            ) : 'Run AI Market Analysis'}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {response && (
          <div className="bg-[#111726] rounded-xl border border-[#C87933]/30 overflow-hidden">
            <div className="p-6">
              {renderMarketAnalysis(response)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMarketAnalysis;