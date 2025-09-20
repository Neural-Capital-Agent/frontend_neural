import React, { useState } from 'react';
import { useDataAgent, usePortfolioAgent, usePlannerAgent, useExplainerAgent, useCrewAI } from '../hooks/useAgents';

const AgentDashboard = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [results, setResults] = useState({});

  // Agent hooks
  const dataAgent = useDataAgent();
  const portfolioAgent = usePortfolioAgent();
  const plannerAgent = usePlannerAgent();
  const explainerAgent = useExplainerAgent();
  const crewAI = useCrewAI();

  const handleGetMarketData = async () => {
    try {
      const data = await dataAgent.getMarketData(selectedStock);
      setResults(prev => ({ ...prev, marketData: data }));
    } catch (error) {
      console.error('Market data error:', error);
    }
  };

  const handleTechnicalAnalysis = async () => {
    try {
      const data = await dataAgent.getTechnicalAnalysis(selectedStock);
      setResults(prev => ({ ...prev, technicalAnalysis: data }));
    } catch (error) {
      console.error('Technical analysis error:', error);
    }
  };

  const handleQuickAdvice = async () => {
    try {
      const query = `What's your analysis of ${selectedStock}?`;
      const data = await crewAI.quickAdvice(query);
      setResults(prev => ({ ...prev, quickAdvice: data }));
    } catch (error) {
      console.error('Quick advice error:', error);
    }
  };

  const handleExplainJargon = async () => {
    try {
      const text = "What does P/E ratio, market cap, and beta mean for investors?";
      const data = await explainerAgent.translateJargon(text);
      setResults(prev => ({ ...prev, jargonExplanation: data }));
    } catch (error) {
      console.error('Jargon explanation error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-[#111726] rounded-xl p-6 border border-[#C87933]/30">
        <h2 className="text-2xl font-bold text-[#F3ECDC] mb-6">Financial Agents Dashboard</h2>

        {/* Stock Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#9BA4B5] mb-2">
            Select Stock Symbol
          </label>
          <input
            type="text"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value.toUpperCase())}
            className="w-32 bg-[#0A0F1C] border border-[#C87933]/30 text-[#F3ECDC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C87933]"
            placeholder="AAPL"
          />
        </div>

        {/* Agent Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={handleGetMarketData}
            disabled={dataAgent.loading}
            className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {dataAgent.loading ? 'Loading...' : 'Get Market Data'}
          </button>

          <button
            onClick={handleTechnicalAnalysis}
            disabled={dataAgent.loading}
            className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {dataAgent.loading ? 'Loading...' : 'Technical Analysis'}
          </button>

          <button
            onClick={handleQuickAdvice}
            disabled={crewAI.loading}
            className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {crewAI.loading ? 'Loading...' : 'Quick Advice'}
          </button>

          <button
            onClick={handleExplainJargon}
            disabled={explainerAgent.loading}
            className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {explainerAgent.loading ? 'Loading...' : 'Explain Terms'}
          </button>
        </div>

        {/* Error Display */}
        {(dataAgent.error || crewAI.error || explainerAgent.error) && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">
              Error: {dataAgent.error || crewAI.error || explainerAgent.error}
            </p>
          </div>
        )}
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Data */}
        {results.marketData && (
          <div className="bg-[#111726] rounded-xl p-6 border border-[#C87933]/30">
            <h3 className="text-lg font-semibold text-[#F3ECDC] mb-4">Market Data for {selectedStock}</h3>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <pre className="text-[#9BA4B5] text-sm overflow-auto">
                {JSON.stringify(results.marketData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Technical Analysis */}
        {results.technicalAnalysis && (
          <div className="bg-[#111726] rounded-xl p-6 border border-[#C87933]/30">
            <h3 className="text-lg font-semibold text-[#F3ECDC] mb-4">Technical Analysis</h3>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <pre className="text-[#9BA4B5] text-sm overflow-auto">
                {JSON.stringify(results.technicalAnalysis, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Quick Advice */}
        {results.quickAdvice && (
          <div className="bg-[#111726] rounded-xl p-6 border border-[#C87933]/30">
            <h3 className="text-lg font-semibold text-[#F3ECDC] mb-4">AI Advice</h3>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <p className="text-[#F3ECDC] whitespace-pre-line">
                {results.quickAdvice.advice || results.quickAdvice.message || JSON.stringify(results.quickAdvice, null, 2)}
              </p>
            </div>
          </div>
        )}

        {/* Jargon Explanation */}
        {results.jargonExplanation && (
          <div className="bg-[#111726] rounded-xl p-6 border border-[#C87933]/30">
            <h3 className="text-lg font-semibold text-[#F3ECDC] mb-4">Financial Terms Explained</h3>
            <div className="bg-[#0A0F1C] rounded-lg p-4">
              <p className="text-[#F3ECDC] whitespace-pre-line">
                {results.jargonExplanation.explanation || results.jargonExplanation.message || JSON.stringify(results.jargonExplanation, null, 2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;