import React, { useState, useCallback, useEffect } from "react";
import explainabilityAgent from "../services/explainabilityAgent";

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
        const [profile, portfolio] = await Promise.all([
          explainabilityAgent.getUserProfile(userId).catch(() => null),
          explainabilityAgent.getUserPortfolio(userId).catch(() => null)
        ]);

        setUserProfile(profile);
        setUserPortfolio(portfolio);
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

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await explainabilityAgent.getPersonalizedAdvice(question, userId);
      console.log("Enhanced Quick Advice Response:", data);
      setResponse(data);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get personalized advice. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [question, userId]);

  const handlePortfolioAnalysis = useCallback(async () => {
    if (!userId) {
      setError("Please log in to analyze your portfolio.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await explainabilityAgent.analyzePortfolioForUser(userId);
      console.log("Portfolio Analysis Response:", data);
      setResponse({
        ...data,
        isPortfolioAnalysis: true
      });
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to analyze portfolio. Please try again.");
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
        <div className="mt-6 p-6 bg-[#10131C] border border-[#2D3348] rounded-lg">
          <h3 className="text-lg font-semibold text-[#F59E0B] mb-4">
            {response.isPortfolioAnalysis ? "Portfolio Analysis" : "Personalized Analysis"}
          </h3>

          {/* Main advice/analysis */}
          <div className="mb-4">
            <div className="text-white whitespace-pre-line leading-relaxed">
              {response.advice || response.analysis || response.message || JSON.stringify(response, null, 2)}
            </div>
          </div>

          {/* Additional sections for enhanced response */}
          {response.explanation && (
            <div className="mb-4 p-4 bg-[#1A1D29] rounded-lg border border-[#2D3348]">
              <h4 className="text-md font-semibold text-[#C87933] mb-2">Explanation</h4>
              <div className="text-[#9BA4B5] whitespace-pre-line">
                {response.explanation}
              </div>
            </div>
          )}

          {response.recommendations && Array.isArray(response.recommendations) && (
            <div className="mb-4 p-4 bg-[#1A1D29] rounded-lg border border-[#2D3348]">
              <h4 className="text-md font-semibold text-[#C87933] mb-2">Recommendations</h4>
              <ul className="list-disc list-inside text-[#9BA4B5] space-y-1">
                {response.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {response.risk_factors && Array.isArray(response.risk_factors) && (
            <div className="mb-4 p-4 bg-[#1A1D29] rounded-lg border border-[#2D3348]">
              <h4 className="text-md font-semibold text-[#C87933] mb-2">Risk Factors</h4>
              <ul className="list-disc list-inside text-[#9BA4B5] space-y-1">
                {response.risk_factors.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Model and timestamp info */}
          <div className="mt-4 pt-4 border-t border-[#2D3348] text-xs text-[#9BA4B5]">
            <div className="flex justify-between items-center">
              <span>Powered by Mistral LLM • Personalized for your profile</span>
              {response.timestamp && (
                <span>{new Date(response.timestamp).toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 p-3 bg-[#0A0F1C] border border-[#2D3348] rounded-lg">
        <p className="text-xs text-[#9BA4B5]">
          💡 This advice is personalized based on your profile, risk tolerance, and current portfolio.
          The analysis considers your experience level and investment goals to provide contextual recommendations.
        </p>
      </div>
    </div>
  );
};

export default EnhancedQuickAdvice;