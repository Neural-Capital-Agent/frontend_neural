import React, { useState, useEffect } from 'react';
import { useCrewAI } from '../hooks/useAgents';
import FeatureGate from './FeatureGate';

const AIInvestmentAdvisor = () => {
  const [newGoal, setNewGoal] = useState('');
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rerunLoading, setRerunLoading] = useState(false);
  const [error, setError] = useState(null);

  const crewAI = useCrewAI();

  const runCompleteAnalysis = async (goalText = 'Provide comprehensive investment analysis and portfolio recommendations for long-term wealth building') => {
    const isRerun = goalText !== 'Provide comprehensive investment analysis and portfolio recommendations for long-term wealth building';
    const loadingState = isRerun ? setRerunLoading : setLoading;

    loadingState(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId') || 'anonymous';

      const response = await fetch(`http://localhost:8000/api/v1/agents/workflow/complete-analysis?user_id=${userId}`, {
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

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}

      {initialAnalysis && initialAnalysis.results && (
        <div className="space-y-6">
          {/* Agent 4 - Main Explanation Summary */}
          {initialAnalysis.results.explainability_analysis?.main_explanation && (
            <div className="bg-gradient-to-r from-[#C87933]/20 to-transparent p-6 rounded-lg border-l-4 border-[#C87933]">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-[#C87933] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="text-xl font-bold text-[#F3ECDC]">AI Investment Strategy Explanation (Agent 4)</h4>
              </div>
              <div className="text-[#F3ECDC] whitespace-pre-wrap leading-relaxed text-lg">
                {initialAnalysis.results.explainability_analysis.main_explanation}
              </div>
            </div>
          )}

          {/* Agent 3 - Planner Analysis with Monte Carlo */}
          {initialAnalysis.results.planner_analysis && (
            <div className="bg-[#0A0F1C] rounded-lg border border-[#C87933]/30 overflow-hidden">
              <div className="bg-[#111726] px-6 py-4 border-b border-[#C87933]/30">
                <h4 className="text-xl font-semibold text-[#F3ECDC]">📋 Investment Plan Analysis (Agent 3)</h4>
                <p className="text-[#9BA4B5] text-sm mt-1">Enhanced with Mistral LLM parsing and Monte Carlo simulations</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Goal Analysis */}
                {initialAnalysis.results.planner_analysis.goal_parameters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111726] rounded-lg p-4">
                      <h5 className="text-[#C87933] font-medium mb-2">Goal Analysis</h5>
                      <div className="space-y-2 text-sm">
                        {Object.entries(initialAnalysis.results.planner_analysis.goal_parameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-[#9BA4B5] capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-[#F3ECDC] font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {initialAnalysis.results.planner_analysis.success_probability && (
                      <div className="bg-[#111726] rounded-lg p-4">
                        <h5 className="text-[#C87933] font-medium mb-2">Success Probability</h5>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400">{initialAnalysis.results.planner_analysis.success_probability}%</div>
                          <div className="text-[#9BA4B5] text-sm">Based on Monte Carlo simulations</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Monte Carlo Results */}
                {initialAnalysis.results.planner_analysis.monte_carlo_results && (
                  <div className="bg-[#111726] rounded-lg p-4">
                    <h5 className="text-[#C87933] font-medium mb-4">Monte Carlo Simulation Results</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {initialAnalysis.results.planner_analysis.monte_carlo_results.map((scenario, index) => (
                        <div key={index} className="text-center p-3 bg-[#0A0F1C] rounded-lg">
                          <div className="text-lg font-bold text-[#F3ECDC] capitalize">{scenario.scenario_name}</div>
                          <div className="text-sm text-[#9BA4B5]">{scenario.probability}% probability</div>
                          <div className="text-xs text-[#C87933] mt-1">{scenario.iterations} iterations</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Monthly Investment */}
                {initialAnalysis.results.planner_analysis.recommended_monthly_investment && (
                  <div className="bg-gradient-to-r from-green-900/20 to-transparent p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="text-green-400 font-medium mb-2">Recommended Monthly Investment</h5>
                    <div className="text-2xl font-bold text-[#F3ECDC]">
                      ${initialAnalysis.results.planner_analysis.recommended_monthly_investment.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agent 2 - Portfolio Analysis with Stress Testing */}
          {initialAnalysis.results.portfolio_analysis && (
            <div className="bg-[#0A0F1C] rounded-lg border border-[#C87933]/30 overflow-hidden">
              <div className="bg-[#111726] px-6 py-4 border-b border-[#C87933]/30">
                <h4 className="text-xl font-semibold text-[#F3ECDC]">💼 Portfolio Analysis (Agent 2)</h4>
                <p className="text-[#9BA4B5] text-sm mt-1">Enhanced with stress testing and sophisticated rebalancing triggers</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Portfolio Metrics */}
                {initialAnalysis.results.portfolio_analysis.portfolio_metrics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#111726] rounded-lg p-4 text-center">
                      <h5 className="text-[#C87933] font-medium mb-2">Expected Return</h5>
                      <div className="text-2xl font-bold text-green-400">
                        {(initialAnalysis.results.portfolio_analysis.portfolio_metrics.expected_return * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-[#111726] rounded-lg p-4 text-center">
                      <h5 className="text-[#C87933] font-medium mb-2">Expected Risk</h5>
                      <div className="text-2xl font-bold text-yellow-400">
                        {(initialAnalysis.results.portfolio_analysis.portfolio_metrics.expected_risk * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-[#111726] rounded-lg p-4 text-center">
                      <h5 className="text-[#C87933] font-medium mb-2">Sharpe Ratio</h5>
                      <div className="text-2xl font-bold text-blue-400">
                        {initialAnalysis.results.portfolio_analysis.portfolio_metrics.sharpe_ratio?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Asset Allocation */}
                {initialAnalysis.results.portfolio_analysis.allocations && (
                  <div className="bg-[#111726] rounded-lg p-4">
                    <h5 className="text-[#C87933] font-medium mb-4">Recommended Asset Allocation</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(initialAnalysis.results.portfolio_analysis.allocations).map(([asset, allocation]) => (
                        <div key={asset} className="bg-[#0A0F1C] rounded-lg p-3">
                          <div className="text-sm text-[#9BA4B5] capitalize">{asset.replace('_', ' ')}</div>
                          <div className="text-lg font-bold text-[#F3ECDC]">{(allocation * 100).toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stress Test Results */}
                {initialAnalysis.results.portfolio_analysis.stress_tests && (
                  <div className="bg-[#111726] rounded-lg p-4">
                    <h5 className="text-[#C87933] font-medium mb-4">Stress Testing Results</h5>
                    <div className="space-y-2">
                      {initialAnalysis.results.portfolio_analysis.stress_tests.map((test, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-[#0A0F1C] rounded">
                          <span className="text-[#F3ECDC] capitalize">{test.scenario_name.replace('_', ' ')}</span>
                          <span className={`font-bold ${test.portfolio_loss > 0.2 ? 'text-red-400' : test.portfolio_loss > 0.1 ? 'text-yellow-400' : 'text-green-400'}`}>
                            -{(test.portfolio_loss * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rebalancing Triggers */}
                {initialAnalysis.results.portfolio_analysis.rebalancing_triggers && (
                  <div className="bg-[#111726] rounded-lg p-4">
                    <h5 className="text-[#C87933] font-medium mb-4">Sophisticated Rebalancing Triggers</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {initialAnalysis.results.portfolio_analysis.rebalancing_triggers.map((trigger, index) => (
                        <div key={index} className="bg-[#0A0F1C] rounded-lg p-3">
                          <div className="text-sm font-medium text-[#F3ECDC] capitalize">{trigger.trigger_type.replace('_', ' ')}</div>
                          <div className="text-xs text-[#9BA4B5] mt-1">{trigger.description}</div>
                          <div className="text-xs text-[#C87933] mt-1">Threshold: {trigger.threshold}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Investment Theory Explanation */}
          {initialAnalysis.results.explainability_analysis?.investment_theory && (
            <div className="bg-[#0A0F1C] rounded-lg border border-[#C87933]/30 p-6">
              <h4 className="text-xl font-semibold text-[#F3ECDC] mb-4">🎓 Investment Theory (Agent 4)</h4>
              <div className="text-[#F3ECDC] whitespace-pre-wrap leading-relaxed">
                {initialAnalysis.results.explainability_analysis.investment_theory}
              </div>
            </div>
          )}

          {/* Analysis Summary */}
          {initialAnalysis.results.analysis_summary && (
            <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="text-blue-400 font-medium mb-2">Analysis Summary</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#F3ECDC]">{initialAnalysis.results.analysis_summary.total_agents_used}</div>
                  <div className="text-[#9BA4B5]">Agents Used</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#F3ECDC]">{initialAnalysis.results.analysis_summary.simulation_count?.toLocaleString()}</div>
                  <div className="text-[#9BA4B5]">Simulations</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#F3ECDC]">{initialAnalysis.results.analysis_summary.stress_scenarios}</div>
                  <div className="text-[#9BA4B5]">Stress Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#F3ECDC]">{initialAnalysis.results.analysis_summary.rebalancing_triggers}</div>
                  <div className="text-[#9BA4B5]">Rebalancing Rules</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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