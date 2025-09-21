import React, { useState, useCallback, useEffect } from "react";
import frontendLLMService from "../services/frontendLLMService";

const EnhancedQuickAdvice = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userPortfolio, setUserPortfolio] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  // Load user profile and portfolio data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const userData = await frontendLLMService.fetchUserData(userId);
        setUserProfile(userData.profile);
        setUserPortfolio(userData.portfolio);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (!userId) {
      setError("Please log in to get personalized advice.");
      return;
    }

    if (!frontendLLMService.isConfigured()) {
      setError("LLM service is not configured. Please check API key settings.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await frontendLLMService.getPersonalizedAdvice(question, userId);
      console.log("Enhanced Quick Advice Response:", data);
      setResponse(data);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to get personalized advice. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [question, userId]);

  const handlePortfolioAnalysis = useCallback(async () => {
    if (!userId) {
      setError("Please log in to analyze your portfolio.");
      return;
    }

    if (!frontendLLMService.isConfigured()) {
      setError("LLM service is not configured. Please check API key settings.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await frontendLLMService.analyzePortfolio(userId);
      console.log("Portfolio Analysis Response:", data);
      setResponse({
        ...data,
        isPortfolioAnalysis: true
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to analyze portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="bg-[#1A1D29] rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* User Context Display */}
      {profileLoading ? (
        <div className="mb-6 p-4 bg-[#10131C] border border-[#2D3348] rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#9BA4B5]">Loading your profile...</span>
          </div>
        </div>
      ) : userProfile && (
        <div className="mb-6 p-4 bg-[#10131C] border border-[#2D3348] rounded-lg">
          <h3 className="text-lg font-semibold text-[#F59E0B] mb-3">Your Profile Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#9BA4B5]">Risk Tolerance:</span>
              <span className="text-white ml-2 capitalize">{userProfile.risk_tolerance || 'Not set'}</span>
            </div>
            <div>
              <span className="text-[#9BA4B5]">Experience:</span>
              <span className="text-white ml-2 capitalize">{userProfile.experience_level || 'Not set'}</span>
            </div>
            <div>
              <span className="text-[#9BA4B5]">Investment Goals:</span>
              <span className="text-white ml-2">
                {userProfile.investment_goals?.join(', ') || 'Not set'}
              </span>
            </div>
            {userPortfolio && userPortfolio.total_value > 0 && (
              <div>
                <span className="text-[#9BA4B5]">Portfolio Value:</span>
                <span className="text-white ml-2">${userPortfolio.total_value?.toLocaleString() || 0}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handlePortfolioAnalysis}
          disabled={loading || !userId}
          className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
            loading || !userId
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#C87933] text-white hover:bg-[#C87933]/90"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze My Portfolio"}
        </button>
      </div>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-slate-300 mb-2">
            Your Personalized Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={userProfile
              ? `Based on your ${userProfile.risk_tolerance} risk tolerance and ${userProfile.experience_level} experience, what would you like to know? e.g., "Should I rebalance my portfolio now?" or "What sectors should I consider?"`
              : "E.g., Should I invest in tech stocks given the current market conditions?"
            }
            className="w-full p-3 bg-[#10131C] border border-[#2D3348] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] min-h-[120px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !question.trim() || !userId}
          className={`w-full py-3 px-6 rounded-xl font-bold transition duration-200 ${
            loading || !question.trim() || !userId
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90"
          }`}
        >
          {loading ? "Getting Personalized Analysis..." : "Get Personalized Analysis"}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mt-6 space-y-4">
          {/* Main Response Card */}
          <div className="bg-gradient-to-br from-[#C87933]/10 to-[#F59E0B]/5 border border-[#C87933]/30 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#C87933] rounded-full flex items-center justify-center mr-3">
                {response.isPortfolioAnalysis ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#F59E0B]">
                {response.isPortfolioAnalysis ? "📊 Portfolio Analysis" : "🎯 Personalized Advice"}
              </h3>
            </div>

            {/* Main Response Content */}
            <div className="bg-[#0A0F1C] rounded-lg p-4 border border-[#C87933]/20">
              <div className="text-[#F3ECDC] text-lg leading-relaxed font-medium">
                {response.advice || response.analysis || response.message}
              </div>
            </div>

            {/* Question Context (for personalized advice) */}
            {response.question && (
              <div className="mt-4 p-3 bg-[#1A1D29]/50 rounded-lg border border-[#2D3348]">
                <div className="text-sm text-[#9BA4B5] mb-1">Your Question:</div>
                <div className="text-[#F3ECDC] text-sm italic">"{response.question}"</div>
              </div>
            )}
          </div>

          {/* Data Sources Used */}
          {response.dataUsed && (
            <div className="bg-[#10131C] border border-[#2D3348] rounded-lg p-4">
              <h4 className="text-md font-semibold text-[#C87933] mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Data Sources Used
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${response.dataUsed.hasUserProfile ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-[#9BA4B5]">User Profile</span>
                  <span className="text-xs text-[#F3ECDC]">
                    {response.dataUsed.hasUserProfile ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${response.dataUsed.hasMarketData ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-[#9BA4B5]">Market Data</span>
                  <span className="text-xs text-[#F3ECDC]">
                    {response.dataUsed.hasMarketData ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${response.dataUsed.etfCount > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-[#9BA4B5]">ETF Data</span>
                  <span className="text-xs text-[#F3ECDC]">
                    {response.dataUsed.etfCount || 0} ETFs
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Model and timestamp info */}
          <div className="bg-[#0A0F1C] border border-[#2D3348] rounded-lg p-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-xs text-[#9BA4B5]">
              <div className="flex items-center space-x-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Powered by Mistral-7B • Real-time analysis</span>
              </div>
              {response.timestamp && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{new Date(response.timestamp).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 p-3 bg-[#0A0F1C] border border-[#2D3348] rounded-lg">
        <p className="text-xs text-[#9BA4B5]">
          💡 Get concise, personalized financial advice in 30-40 words. Analysis combines your profile, current market data,
          and real-time ETF prices using advanced AI. Responses are tailored to your risk tolerance and investment goals.
        </p>
        {!frontendLLMService.isConfigured() && (
          <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-yellow-200 text-xs">
            ⚠️ LLM service requires API key configuration to provide personalized advice.
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuickAdvice;