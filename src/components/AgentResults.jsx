import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AgentResults = () => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState('all');

  // Sample data structure based on your agent output
  useEffect(() => {
    // This would fetch from your backend API
    const loadAgentData = async () => {
      try {
        // For now, using mock data structure based on your output
        const mockData = {
          dataAgent: {
            marketData: [
              { symbol: 'AAPL', price: 245.5, change: 7.62, changePercent: 3.20 },
              { symbol: 'MSFT', price: 517.93, change: 9.48, changePercent: 1.86 },
              { symbol: 'SPY', price: 663.70, change: 3.27, changePercent: 0.50 },
              { symbol: 'BTC-USD', price: 115767.09, change: 74.79, changePercent: 0.06 }
            ],
            macroData: {
              GDP: { value: 30353.902, trend: 'up' },
              INFLATION: { value: 323.976, trend: 'up' },
              UNEMPLOYMENT: { value: 4.3, trend: 'stable' },
              INTEREST_RATES: { value: 4.33, trend: 'stable' }
            }
          },
          portfolioAgent: {
            portfolio: {
              id: "8476e123-72c3-442f-b9fc-b13857013d6b",
              allocations: { SPY: 0.4, VXUS: 0.2, BND: 0.2, IEF: 0.1, GLD: 0.1 },
              expectedReturn: 0.073,
              expectedRisk: 0.076,
              sharpeRatio: 0.966
            },
            rebalance: {
              actions: [
                { ticker: 'SPY', action: 'sell', amount: 0.05, reason: 'Reduce overweight position' },
                { ticker: 'SHY', action: 'buy', amount: 0.017, reason: 'Add short-term bonds' }
              ]
            }
          },
          plannerAgent: {
            goal: {
              goalType: 'child_education',
              targetAmount: 500000,
              timeHorizon: 15,
              monthlyInvestment: 1200,
              confidence: 'medium'
            },
            strategy: {
              allocationType: 'balanced',
              expectedReturn: 0.076,
              allocation: { equities: 0.6, bonds: 0.4 }
            }
          },
          explainabilityAgent: {
            summary: "Balanced portfolio allocation optimized for moderate risk tolerance and retirement goals",
            riskLevel: 'moderate',
            confidence: 0.3,
            timestamp: new Date().toISOString()
          }
        };
        setAgentData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading agent data:', error);
        setLoading(false);
      }
    };

    loadAgentData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-8 mx-4 my-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C87933]"></div>
          <span className="ml-3 text-[#F3ECDC]">Loading agent results...</span>
        </div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-8 mx-4 my-6">
        <div className="text-center text-[#9BA4B5]">
          <p>No agent data available</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const COLORS = ['#C87933', '#F3ECDC', '#9BA4B5', '#667080', '#4A5568'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 mx-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#F3ECDC] tracking-wide">Agent Analysis Results</h2>
            <p className="text-sm text-[#9BA4B5] mt-1">
              Comprehensive AI-driven financial analysis and recommendations
            </p>
          </div>
          <div className="flex space-x-2">
            {['all', 'data', 'portfolio', 'planner', 'explainer'].map((agent) => (
              <button
                key={agent}
                onClick={() => setActiveAgent(agent)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  activeAgent === agent
                    ? 'bg-[#C87933] text-[#F3ECDC]'
                    : 'bg-[#C87933]/10 border border-[#C87933]/30 text-[#F3ECDC] hover:bg-[#C87933]/20'
                }`}
              >
                {agent === 'all' ? 'All' : `Agent ${agent.charAt(0).toUpperCase() + agent.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Agent Results */}
      {(activeAgent === 'all' || activeAgent === 'data') && (
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 mx-4">
          <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">📊 Data Agent - Market Analysis</h3>

          {/* Market Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {agentData.dataAgent.marketData.map((stock) => (
              <div key={stock.symbol} className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
                <div className="text-sm text-[#9BA4B5] uppercase tracking-wider">{stock.symbol}</div>
                <div className="text-xl font-bold text-[#F3ECDC]">{formatCurrency(stock.price)}</div>
                <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>

          {/* Macro Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(agentData.dataAgent.macroData).map(([key, data]) => (
              <div key={key} className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
                <div className="text-sm text-[#9BA4B5] uppercase tracking-wider">{key.replace('_', ' ')}</div>
                <div className="text-lg font-semibold text-[#F3ECDC]">
                  {key === 'GDP' ? `$${(data.value / 1000).toFixed(1)}T` :
                   key === 'INFLATION' ? data.value.toFixed(1) :
                   key === 'UNEMPLOYMENT' ? `${data.value}%` :
                   `${data.value}%`}
                </div>
                <div className="text-xs text-[#9BA4B5] capitalize">{data.trend}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Agent Results */}
      {(activeAgent === 'all' || activeAgent === 'portfolio') && (
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 mx-4">
          <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">💼 Portfolio Agent - Recommendations</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation Chart */}
            <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
              <h4 className="text-lg font-medium text-[#F3ECDC] mb-3">Recommended Allocation</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Object.entries(agentData.portfolioAgent.portfolio.allocations).map(([name, value]) => ({
                      name,
                      value: value * 100
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {Object.keys(agentData.portfolioAgent.portfolio.allocations).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Portfolio Metrics */}
            <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
              <h4 className="text-lg font-medium text-[#F3ECDC] mb-3">Portfolio Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Expected Return</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {formatPercent(agentData.portfolioAgent.portfolio.expectedReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Expected Risk</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {formatPercent(agentData.portfolioAgent.portfolio.expectedRisk)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Sharpe Ratio</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {agentData.portfolioAgent.portfolio.sharpeRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rebalancing Actions */}
          {agentData.portfolioAgent.rebalance.actions.length > 0 && (
            <div className="mt-6 bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
              <h4 className="text-lg font-medium text-[#F3ECDC] mb-3">Rebalancing Actions</h4>
              <div className="space-y-2">
                {agentData.portfolioAgent.rebalance.actions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-[#C87933]/10 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        action.action === 'buy' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      <span className="text-[#F3ECDC] font-medium">{action.ticker}</span>
                      <span className="text-[#9BA4B5] capitalize">{action.action}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F3ECDC]">{formatPercent(action.amount)}</div>
                      <div className="text-xs text-[#9BA4B5]">{action.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Planner Agent Results */}
      {(activeAgent === 'all' || activeAgent === 'planner') && (
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 mx-4">
          <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">🎯 Planner Agent - Goal Strategy</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal Overview */}
            <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
              <h4 className="text-lg font-medium text-[#F3ECDC] mb-3">Goal Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Goal Type</span>
                  <span className="text-[#F3ECDC] font-medium capitalize">
                    {agentData.plannerAgent.goal.goalType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Target Amount</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {formatCurrency(agentData.plannerAgent.goal.targetAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Time Horizon</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {agentData.plannerAgent.goal.timeHorizon} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Monthly Investment</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {formatCurrency(agentData.plannerAgent.goal.monthlyInvestment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Confidence Level</span>
                  <span className="text-[#F3ECDC] font-medium capitalize">
                    {agentData.plannerAgent.goal.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Strategy Details */}
            <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
              <h4 className="text-lg font-medium text-[#F3ECDC] mb-3">Recommended Strategy</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Allocation Type</span>
                  <span className="text-[#F3ECDC] font-medium capitalize">
                    {agentData.plannerAgent.strategy.allocationType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA4B5]">Expected Return</span>
                  <span className="text-[#F3ECDC] font-medium">
                    {formatPercent(agentData.plannerAgent.strategy.expectedReturn)}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-[#9BA4B5] mb-2">Asset Allocation</div>
                  {Object.entries(agentData.plannerAgent.strategy.allocation).map(([asset, percent]) => (
                    <div key={asset} className="flex justify-between mb-1">
                      <span className="text-[#F3ECDC] capitalize">{asset}</span>
                      <span className="text-[#F3ECDC]">{formatPercent(percent)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainability Agent Results */}
      {(activeAgent === 'all' || activeAgent === 'explainer') && (
        <div className="bg-[#111726]/95 border border-[#C87933]/20 shadow-xl rounded-xl p-6 mx-4">
          <h3 className="text-xl font-semibold text-[#F3ECDC] mb-4">🧠 Explainability Agent - AI Insights</h3>

          <div className="bg-[#0A0F1C]/50 border border-[#C87933]/10 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-medium text-[#F3ECDC]">AI Decision Summary</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#9BA4B5]">Confidence:</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  agentData.explainabilityAgent.confidence >= 0.7 ? 'bg-green-400/20 text-green-400' :
                  agentData.explainabilityAgent.confidence >= 0.4 ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {formatPercent(agentData.explainabilityAgent.confidence)}
                </div>
              </div>
            </div>

            <div className="text-[#F3ECDC] leading-relaxed mb-4">
              {agentData.explainabilityAgent.summary}
            </div>

            <div className="flex items-center justify-between text-sm text-[#9BA4B5]">
              <span>Risk Level: <span className="text-[#F3ECDC] capitalize">{agentData.explainabilityAgent.riskLevel}</span></span>
              <span>Generated: {new Date(agentData.explainabilityAgent.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentResults;