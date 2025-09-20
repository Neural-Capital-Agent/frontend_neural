import React, { useState } from 'react';
import { useCrewAI } from '../hooks/useAgents';

const PortfolioAdvisory = () => {
  const [portfolioData, setPortfolioData] = useState({
    goal: '',
    riskTolerance: '3',
    timeHorizon: '',
    currentPortfolio: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const crewAI = useCrewAI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const advisoryData = {
        financial_goal: portfolioData.goal,
        risk_tolerance: parseInt(portfolioData.riskTolerance),
        time_horizon: portfolioData.timeHorizon,
        current_portfolio: portfolioData.currentPortfolio,
        user_id: localStorage.getItem('userId')
      };

      const result = await crewAI.portfolioAdvisory(advisoryData);
      setResponse(result);
    } catch (err) {
      console.error('Portfolio advisory error:', err);
      setError(err.message || 'Failed to get portfolio advice. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderPortfolioAdvice = (data) => {
    if (!data || !data.advice) {
      return <p className="text-[#9BA4B5]">No advice available</p>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#C87933]/20 to-transparent p-4 rounded-lg border-l-4 border-[#C87933]">
          <h3 className="text-xl font-bold text-[#F3ECDC] mb-2">Portfolio Advisory Report</h3>
          <p className="text-[#9BA4B5] text-sm">Personalized recommendations based on your profile</p>
        </div>

        <div className="bg-[#0A0F1C] rounded-lg p-6">
          <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Investment Recommendations</h4>
          <div className="prose prose-invert max-w-none">
            <div className="text-[#F3ECDC] whitespace-pre-line leading-relaxed">
              {typeof data.advice === 'string' ? data.advice : JSON.stringify(data.advice, null, 2)}
            </div>
          </div>
        </div>

        {data.allocation && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Recommended Allocation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.allocation).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center justify-between p-3 bg-[#111726] rounded-lg">
                  <span className="text-[#F3ECDC] capitalize">{asset.replace('_', ' ')}</span>
                  <span className="text-[#C87933] font-bold">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.risk_analysis && (
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Risk Analysis</h4>
            <p className="text-[#9BA4B5]">{data.risk_analysis}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#F3ECDC] mb-2">Portfolio Advisory</h2>
          <p className="text-[#9BA4B5]">Get personalized portfolio recommendations based on your financial goals and risk profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
              Financial Goal
            </label>
            <textarea
              value={portfolioData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              placeholder="Describe your financial goals (e.g., retirement in 20 years, buying a house in 5 years, growing wealth)"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Risk Tolerance (1-5)
              </label>
              <select
                value={portfolioData.riskTolerance}
                onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              >
                <option value="1">1 - Very Conservative</option>
                <option value="2">2 - Conservative</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Aggressive</option>
                <option value="5">5 - Very Aggressive</option>
              </select>
            </div>

            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Investment Time Horizon
              </label>
              <select
                value={portfolioData.timeHorizon}
                onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
                required
              >
                <option value="">Select time horizon</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
              Current Portfolio (Optional)
            </label>
            <textarea
              value={portfolioData.currentPortfolio}
              onChange={(e) => handleInputChange('currentPortfolio', e.target.value)}
              className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              placeholder="Describe your current holdings (e.g., 60% stocks, 30% bonds, 10% cash, specific ETFs/stocks you own)"
              rows={3}
            />
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
                Analyzing Portfolio...
              </span>
            ) : 'Get Portfolio Advisory'}
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
              {renderPortfolioAdvice(response)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAdvisory;