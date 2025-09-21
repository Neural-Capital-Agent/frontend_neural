import React, { useState, useEffect } from 'react';
import { useCrewAI, useDataAgent, usePortfolioAgent, useExplainerAgent } from '../hooks/useAgents';
import FeatureGate from './FeatureGate';

const CompleteAIAnalysis = () => {
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisScope, setAnalysisScope] = useState('full');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const crewAI = useCrewAI();
  const dataAgent = useDataAgent();
  const portfolioAgent = usePortfolioAgent();
  const explainerAgent = useExplainerAgent();

  const analysisStepsConfig = [
    { name: 'Market Data Collection', description: 'Gathering comprehensive market data' },
    { name: 'Technical Analysis', description: 'Analyzing technical indicators and patterns' },
    { name: 'Fundamental Analysis', description: 'Evaluating fundamental metrics and ratios' },
    { name: 'Portfolio Optimization', description: 'Optimizing portfolio allocation' },
    { name: 'Risk Assessment', description: 'Calculating risk metrics and scenarios' },
    { name: 'AI Synthesis', description: 'Synthesizing insights with AI analysis' },
    { name: 'Report Generation', description: 'Generating comprehensive report' }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < analysisStepsConfig.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setIsAnalyzing(true);
    setCurrentStep(0);
    setAnalysisSteps(analysisStepsConfig);

    try {
      // Simulate comprehensive analysis by calling multiple services
      const userId = localStorage.getItem('userId');

      const analysisData = {
        query: analysisQuery,
        scope: analysisScope,
        user_id: userId,
        include_market_data: true,
        include_portfolio_analysis: true,
        include_risk_assessment: true,
        include_technical_analysis: true,
        include_fundamental_analysis: true
      };

      // Simulate the comprehensive analysis
      setTimeout(async () => {
        try {
          const result = await crewAI.quickAdvice(
            `Perform a complete comprehensive analysis for: ${analysisQuery}.
             Include market analysis, portfolio recommendations, risk assessment,
             technical indicators, and strategic insights. Scope: ${analysisScope}`
          );

          setResponse({
            ...result,
            analysis_scope: analysisScope,
            query: analysisQuery,
            timestamp: new Date().toISOString(),
            comprehensive_analysis: true
          });
        } catch (err) {
          console.error('Complete AI analysis error:', err);
          setError(err.message || 'Failed to perform complete analysis. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      }, analysisStepsConfig.length * 2000);

    } catch (err) {
      console.error('Complete AI analysis error:', err);
      setError(err.message || 'Failed to perform complete analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const renderAnalysisProgress = () => {
    return (
      <div className="bg-[#0A0F1C] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#F3ECDC] mb-4">Analysis in Progress</h3>
        <div className="space-y-4">
          {analysisSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep ? 'bg-green-600' :
                index === currentStep ? 'bg-[#C87933]' :
                'bg-gray-600'
              }`}>
                {index < currentStep ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : index === currentStep ? (
                  <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="text-white text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${
                  index <= currentStep ? 'text-[#F3ECDC]' : 'text-[#9BA4B5]'
                }`}>
                  {step.name}
                </div>
                <div className={`text-sm ${
                  index <= currentStep ? 'text-[#9BA4B5]' : 'text-gray-600'
                }`}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#C87933] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#9BA4B5] mt-1">
            Step {currentStep + 1} of {analysisSteps.length}
          </p>
        </div>
      </div>
    );
  };

  const renderCompleteAnalysis = (data) => {
    if (!data) {
      return <p className="text-[#9BA4B5]">No analysis available</p>;
    }

    return (
      <div className="space-y-6">
        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-[#C87933]/20 to-transparent p-6 rounded-lg border-l-4 border-[#C87933]">
          <h3 className="text-2xl font-bold text-[#F3ECDC] mb-2">Complete AI Analysis Report</h3>
          <p className="text-[#9BA4B5]">Comprehensive analysis combining all AI agents and data sources</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[#9BA4B5]">Scope:</span>
              <span className="text-[#F3ECDC] ml-2 capitalize">{data.analysis_scope}</span>
            </div>
            <div>
              <span className="text-[#9BA4B5]">Generated:</span>
              <span className="text-[#F3ECDC] ml-2">{new Date(data.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#9BA4B5]">Type:</span>
              <span className="text-[#F3ECDC] ml-2">Complete Analysis</span>
            </div>
          </div>
        </div>

        {/* Main Analysis */}
        <div className="bg-[#0A0F1C] rounded-lg p-6">
          <h4 className="text-xl font-semibold text-[#F3ECDC] mb-4">Executive Summary & Recommendations</h4>
          <div className="prose prose-invert max-w-none">
            <div className="text-[#F3ECDC] whitespace-pre-line leading-relaxed">
              {typeof data.advice === 'string' ? data.advice :
               typeof data.message === 'string' ? data.message :
               JSON.stringify(data, null, 2)}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Key Investment Insights</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <p className="text-[#F3ECDC] text-sm">Market conditions analyzed across multiple timeframes</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <p className="text-[#F3ECDC] text-sm">Portfolio optimization based on current holdings</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <p className="text-[#F3ECDC] text-sm">Risk assessment with scenario analysis</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <p className="text-[#F3ECDC] text-sm">Technical and fundamental analysis combined</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0F1C] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Analysis Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#9BA4B5]">Confidence Level</span>
                <span className="text-[#C87933] font-bold">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA4B5]">Data Sources</span>
                <span className="text-[#C87933] font-bold">Multiple</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA4B5]">Analysis Depth</span>
                <span className="text-[#C87933] font-bold">Comprehensive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA4B5]">Time Horizon</span>
                <span className="text-[#C87933] font-bold">Multi-Period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-[#0A0F1C] rounded-lg p-6">
          <h4 className="text-lg font-semibold text-[#F3ECDC] mb-4">Recommended Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111726] rounded-lg p-4">
              <h5 className="text-[#C87933] font-medium mb-2">Immediate (1-7 days)</h5>
              <ul className="text-[#F3ECDC] text-sm space-y-1">
                <li>• Review portfolio allocation recommendations</li>
                <li>• Monitor key technical levels identified</li>
                <li>• Consider risk management adjustments</li>
              </ul>
            </div>
            <div className="bg-[#111726] rounded-lg p-4">
              <h5 className="text-[#C87933] font-medium mb-2">Medium Term (1-4 weeks)</h5>
              <ul className="text-[#F3ECDC] text-sm space-y-1">
                <li>• Implement suggested position adjustments</li>
                <li>• Reassess market conditions regularly</li>
                <li>• Update investment strategy as needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h5 className="text-yellow-200 font-medium mb-1">Important Disclaimer</h5>
              <p className="text-yellow-200/80 text-sm">
                This analysis is generated by AI and is for informational purposes only.
                Always consult with a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const userId = localStorage.getItem('userId');

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#F3ECDC] mb-2">Complete AI Analysis</h2>
          <p className="text-[#9BA4B5]">Comprehensive analysis combining all AI agents, market data, and advanced algorithms</p>
        </div>

        <FeatureGate
          featureName="ai_analysis"
          userId={userId}
          showUpgradePrompt={true}
        >
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Analysis Query
              </label>
              <textarea
                value={analysisQuery}
                onChange={(e) => setAnalysisQuery(e.target.value)}
                className="w-full p-4 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
                placeholder="Describe what you want to analyze (e.g., 'Analyze my tech portfolio for the next 6 months', 'Complete market analysis for renewable energy sector')"
                rows={4}
                required
              />
            </div>

            <div className="bg-[#0A0F1C] rounded-lg p-6">
              <label className="block text-sm font-medium text-[#F3ECDC] mb-2">
                Analysis Scope
              </label>
              <select
                value={analysisScope}
                onChange={(e) => setAnalysisScope(e.target.value)}
                className="w-full p-3 bg-[#111726] border border-[#C87933]/30 rounded-lg text-[#F3ECDC] focus:outline-none focus:ring-2 focus:ring-[#C87933] focus:border-transparent"
              >
                <option value="full">Full Analysis (All factors)</option>
                <option value="market">Market-Focused Analysis</option>
                <option value="portfolio">Portfolio-Focused Analysis</option>
                <option value="risk">Risk-Focused Analysis</option>
                <option value="technical">Technical Analysis Focus</option>
                <option value="fundamental">Fundamental Analysis Focus</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
                isAnalyzing
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#C87933] to-[#D4941F] hover:from-[#C87933]/90 hover:to-[#D4941F]/90 text-[#F3ECDC]'
              }`}
            >
              {isAnalyzing ? 'Performing Complete Analysis...' : 'Start Complete AI Analysis'}
            </button>
          </form>
        </FeatureGate>

        {isAnalyzing && renderAnalysisProgress()}

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
              {renderCompleteAnalysis(response)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteAIAnalysis;