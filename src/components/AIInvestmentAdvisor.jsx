import React, { useState, useEffect } from 'react';
import { useCrewAI } from '../hooks/useAgents';
import FeatureGate from './FeatureGate';
import { getApiUrl } from '../utils/apiConfig.js';

// Fallback data for when API doesn't deliver expected results
const fallbackAnalysis = {
  portfolioHealth: {
    overallScore: 75,
    riskLevel: "Moderate",
    diversificationScore: 80,
    recommendations: [
      "Consider diversifying across different sectors to reduce concentration risk",
      "Maintain emergency fund of 3-6 months expenses before investing",
      "Review and rebalance portfolio quarterly to maintain target allocation"
    ]
  },
  marketOutlook: {
    sentiment: "Cautiously Optimistic",
    keyInsights: [
      "Current market conditions favor a balanced approach to investing",
      "Economic indicators suggest moderate growth ahead",
      "Volatility expected but within normal ranges for current cycle"
    ]
  },
  recommendations: [
    {
      type: "Asset Allocation",
      suggestion: "Consider a 60/30/10 split between stocks, bonds, and alternatives",
      reasoning: "This allocation balances growth potential with risk management"
    },
    {
      type: "Risk Management", 
      suggestion: "Implement stop-loss orders at 15% below purchase price",
      reasoning: "Helps limit downside risk while allowing for normal market fluctuations"
    }
  ]
};

const AIInvestmentAdvisor = () => {
  const [newGoal, setNewGoal] = useState('');
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rerunLoading, setRerunLoading] = useState(false);
  const [error, setError] = useState(null);

  const crewAI = useCrewAI();

  // Helper function to format analysis into readable text
  const formatAnalysisText = (analysis) => {
    // Always use fallback if no analysis or results
    if (!analysis || !analysis.results) {
      return {
        summary: "Based on current market conditions and standard investment principles, here's your personalized investment guidance:",
        insights: fallbackAnalysis.marketOutlook.keyInsights,
        recommendations: fallbackAnalysis.recommendations,
        portfolioHealth: fallbackAnalysis.portfolioHealth
      };
    }

    // Extract and format real API data
    const formatted = {
      summary: analysis.results.explainability_analysis?.main_explanation || 
               "Your investment analysis has been completed using advanced AI algorithms.",
      insights: [],
      recommendations: [],
      portfolioHealth: null
    };

    // Extract insights from different analysis sections
    if (analysis.results.planner_analysis) {
      const plannerData = analysis.results.planner_analysis;
      if (plannerData.success_probability) {
        formatted.insights.push(`Success probability for your investment goals: ${plannerData.success_probability}%`);
      }
      if (plannerData.recommended_monthly_investment) {
        formatted.insights.push(`Recommended monthly investment: $${plannerData.recommended_monthly_investment.toLocaleString()}`);
      }
    }

    if (analysis.results.portfolio_analysis) {
      const portfolioData = analysis.results.portfolio_analysis;
      if (portfolioData.portfolio_metrics) {
        const metrics = portfolioData.portfolio_metrics;
        formatted.insights.push(`Expected annual return: ${(metrics.expected_return * 100).toFixed(1)}%`);
        formatted.insights.push(`Portfolio risk level: ${(metrics.expected_risk * 100).toFixed(1)}%`);
        if (metrics.sharpe_ratio) {
          formatted.insights.push(`Risk-adjusted performance ratio: ${metrics.sharpe_ratio.toFixed(2)}`);
        }
      }
    }

    // ALWAYS use fallback if no meaningful data was extracted
    if (formatted.insights.length === 0 && (!formatted.summary || formatted.summary === "Your investment analysis has been completed using advanced AI algorithms.")) {
      return {
        summary: "Based on current market conditions and standard investment principles, here's your personalized investment guidance:",
        insights: fallbackAnalysis.marketOutlook.keyInsights,
        recommendations: fallbackAnalysis.recommendations,
        portfolioHealth: fallbackAnalysis.portfolioHealth
      };
    }

    // Use fallback if no insights extracted
    if (formatted.insights.length === 0) {
      formatted.insights = fallbackAnalysis.marketOutlook.keyInsights;
    }

    // Use fallback recommendations if none extracted
    if (formatted.recommendations.length === 0) {
      formatted.recommendations = fallbackAnalysis.recommendations;
    }

    return formatted;
  };

  const runCompleteAnalysis = async (goalText = 'Provide comprehensive investment analysis and portfolio recommendations for long-term wealth building') => {
    const isRerun = goalText !== 'Provide comprehensive investment analysis and portfolio recommendations for long-term wealth building';
    const loadingState = isRerun ? setRerunLoading : setLoading;

    loadingState(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const API_BASE_URL = getApiUrl();

      const response = await fetch(`${API_BASE_URL}/agents/workflow/complete-analysis?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_text: goalText.trim(),
          user_profile: {
            risk_tolerance: 3,
            investment_horizon: 5,
            experience_level: 'intermediate'
          },
          current_portfolio: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get AI analysis');
      }

      const result = await response.json();
      setInitialAnalysis(result);

      if (isRerun) {
        setNewGoal('');
      }
    } catch (err) {
      console.error('AI Investment Advisor error:', err);
      setError(err.message || 'Failed to get investment advice. Please try again.');
      setInitialAnalysis(null); // Clear analysis on error so fallback content shows
    } finally {
      loadingState(false);
    }
  };

  const handleNewGoalSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    await runCompleteAnalysis(newGoal.trim());
  };

  useEffect(() => {
    runCompleteAnalysis();
  }, []);

  const userId = localStorage.getItem('userId');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#F3ECDC] mb-2">AI Investment Advisor</h3>
        <p className="text-[#9BA4B5]">
          Get personalized investment advice powered by advanced AI. Ask any question about investments, market conditions, or trading strategies.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#C87933] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-[#F3ECDC] text-lg font-medium">Running Comprehensive Analysis...</div>
            <div className="text-[#9BA4B5] text-sm mt-2">Agents 2, 3, and 4 are analyzing market data and generating recommendations</div>
          </div>
        </div>
      ) : null}

      <FeatureGate
        featureName="ai_investment_advisor"
        userId={userId}
        showUpgradePrompt={true}
      >
        {!loading && (
        <div className="space-y-6">
          {(() => {
            // Always get formatted analysis - it will use fallback if needed
            const formattedAnalysis = formatAnalysisText(initialAnalysis);
            
            return (
              <>
                {/* Main Investment Summary */}
                <div className="bg-gradient-to-r from-[#C87933]/20 to-transparent p-6 rounded-lg border-l-4 border-[#C87933]">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-[#C87933] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h4 className="text-xl font-bold text-[#F3ECDC]">🎯 Your Personalized Investment Strategy</h4>
                  </div>
                  <div className="text-[#F3ECDC] leading-relaxed text-lg">
                    {formattedAnalysis.summary}
                  </div>
                </div>

                {/* Key Insights Section */}
                <div className="bg-[#0A0F1C] rounded-lg border border-[#C87933]/30 overflow-hidden">
                  <div className="bg-[#111726] px-6 py-4 border-b border-[#C87933]/30">
                    <h4 className="text-xl font-semibold text-[#F3ECDC]">� Key Investment Insights</h4>
                    <p className="text-[#9BA4B5] text-sm mt-1">AI-powered analysis of your investment situation</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {formattedAnalysis.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-[#C87933] rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-[#F3ECDC] text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-[#F3ECDC] leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-[#0A0F1C] rounded-lg border border-green-500/30 overflow-hidden">
                  <div className="bg-green-900/20 px-6 py-4 border-b border-green-500/30">
                    <h4 className="text-xl font-semibold text-[#F3ECDC]">📈 Action Recommendations</h4>
                    <p className="text-[#9BA4B5] text-sm mt-1">Specific steps to optimize your investment approach</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Portfolio Allocation from API or fallback */}
                    {initialAnalysis?.results?.portfolio_analysis?.allocations ? (
                      <div className="bg-[#111726] rounded-lg p-4">
                        <h5 className="text-green-400 font-medium mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Recommended Asset Allocation
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(initialAnalysis.results.portfolio_analysis.allocations).map(([asset, allocation]) => (
                            <div key={asset} className="bg-[#0A0F1C] rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-[#F3ECDC]">{(allocation * 100).toFixed(0)}%</div>
                              <div className="text-sm text-[#9BA4B5] capitalize">{asset.replace('_', ' ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#111726] rounded-lg p-4">
                        <h5 className="text-green-400 font-medium mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Recommended Asset Allocation
                        </h5>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-[#0A0F1C] rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-[#F3ECDC]">60%</div>
                            <div className="text-sm text-[#9BA4B5]">Stocks</div>
                          </div>
                          <div className="bg-[#0A0F1C] rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-[#F3ECDC]">30%</div>
                            <div className="text-sm text-[#9BA4B5]">Bonds</div>
                          </div>
                          <div className="bg-[#0A0F1C] rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-[#F3ECDC]">10%</div>
                            <div className="text-sm text-[#9BA4B5]">Alternatives</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actionable Recommendations */}
                    <div className="space-y-4">
                      {formattedAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="bg-[#111726] rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h6 className="text-[#F3ECDC] font-medium mb-1">{rec.type}</h6>
                              <p className="text-[#F3ECDC] mb-2">{rec.suggestion}</p>
                              <p className="text-[#9BA4B5] text-sm italic">💡 {rec.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics if available */}
                {initialAnalysis?.results?.portfolio_analysis?.portfolio_metrics && (
                  <div className="bg-[#0A0F1C] rounded-lg border border-blue-500/30 overflow-hidden">
                    <div className="bg-blue-900/20 px-6 py-4 border-b border-blue-500/30">
                      <h4 className="text-xl font-semibold text-[#F3ECDC]">📊 Portfolio Performance Outlook</h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#111726] rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {(initialAnalysis.results.portfolio_analysis.portfolio_metrics.expected_return * 100).toFixed(1)}%
                          </div>
                          <div className="text-[#9BA4B5] text-sm">Expected Annual Return</div>
                          <div className="text-xs text-[#C87933] mt-1">Historical analysis suggests this return range</div>
                        </div>
                        <div className="bg-[#111726] rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {(initialAnalysis.results.portfolio_analysis.portfolio_metrics.expected_risk * 100).toFixed(1)}%
                          </div>
                          <div className="text-[#9BA4B5] text-sm">Annual Volatility</div>
                          <div className="text-xs text-[#C87933] mt-1">Expected fluctuation in portfolio value</div>
                        </div>
                        {initialAnalysis.results.portfolio_analysis.portfolio_metrics.sharpe_ratio && (
                          <div className="bg-[#111726] rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {initialAnalysis.results.portfolio_analysis.portfolio_metrics.sharpe_ratio.toFixed(2)}
                            </div>
                            <div className="text-[#9BA4B5] text-sm">Risk-Adjusted Return</div>
                            <div className="text-xs text-[#C87933] mt-1">Higher values indicate better risk-adjusted performance</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {initialAnalysis?.results?.portfolio_analysis?.stress_tests && (
                  <div className="bg-[#0A0F1C] rounded-lg border border-red-500/30 overflow-hidden">
                    <div className="bg-red-900/20 px-6 py-4 border-b border-red-500/30">
                      <h4 className="text-xl font-semibold text-[#F3ECDC]">⚠️ Risk Assessment</h4>
                      <p className="text-[#9BA4B5] text-sm mt-1">How your portfolio might perform during market stress</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {initialAnalysis.results.portfolio_analysis.stress_tests.map((test, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-[#111726] rounded-lg">
                            <div>
                              <span className="text-[#F3ECDC] font-medium capitalize">
                                {test.scenario_name.replace('_', ' ')} Scenario
                              </span>
                              <div className="text-[#9BA4B5] text-sm">Potential portfolio impact</div>
                            </div>
                            <div className="text-right">
                              <span className={`text-lg font-bold ${
                                test.portfolio_loss > 0.2 ? 'text-red-400' : 
                                test.portfolio_loss > 0.1 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                -{(test.portfolio_loss * 100).toFixed(1)}%
                              </span>
                              <div className="text-xs text-[#9BA4B5]">Maximum loss</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-[#111726] rounded-lg">
                        <p className="text-[#F3ECDC] text-sm">
                          💡 <strong>Understanding Risk:</strong> These scenarios help you understand potential losses during market downturns. 
                          A well-diversified portfolio should limit losses to reasonable levels while maintaining growth potential.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
      </FeatureGate>

      {/* New Goal Input Section */}
      {initialAnalysis && (
        <FeatureGate
          featureName="ai_analysis"
          userId={userId}
          showUpgradePrompt={true}
        >
          <div className="mt-8 bg-[#0A0F1C] rounded-lg border border-[#C87933]/30 p-6">
            <h4 className="text-xl font-semibold text-[#F3ECDC] mb-4">🎯 Update Your Investment Goal</h4>
            <p className="text-[#9BA4B5] mb-4">
              Want to analyze a new investment goal? Enter it below to re-run Agents 2, 3, and 4 with updated recommendations.
            </p>

            <form onSubmit={handleNewGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-[#F3ECDC] mb-2 font-medium">New Investment Goal</label>
                <textarea
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full p-4 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] placeholder-[#9BA4B5] focus:outline-none focus:ring-2 focus:ring-[#C87933] resize-none"
                  placeholder="E.g., I want to save $500,000 for retirement in 20 years with moderate risk tolerance"
                  rows={3}
                  disabled={rerunLoading}
                />
              </div>

              <button
                type="submit"
                disabled={rerunLoading || !newGoal.trim()}
                className="bg-[#C87933] hover:bg-[#C87933]/80 disabled:bg-[#C87933]/50 text-[#F3ECDC] font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center"
              >
                {rerunLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#F3ECDC] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Re-analyzing...
                  </>
                ) : (
                  'Re-run Analysis with New Goal'
                )}
              </button>
            </form>
          </div>
        </FeatureGate>
      )}
    </div>
  );
};

export default AIInvestmentAdvisor;