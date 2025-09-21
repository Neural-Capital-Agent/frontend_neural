// Frontend LLM Service for Quick Advice
// Uses AI/ML API with Mistral model directly from frontend

import dashboardApi from './dashboardApi.js';
import { getApiUrl } from '../utils/apiConfig.js';

class FrontendLLMService {
  constructor() {
    this.apiKey = import.meta.env.VITE_AI_ML_API_KEY;
    this.baseURL = "https://api.aimlapi.com/v1";
    this.model = "mistralai/Mistral-7B-Instruct-v0.3";
    this.maxTokens = 150; // For concise 30-40 word responses

    if (!this.apiKey) {
      console.warn('AI_ML_API_KEY not found in environment variables');
    }
  }

  async makeAPICall(messages, maxTokens = this.maxTokens) {
    if (!this.apiKey) {
      throw new Error('AI_ML_API_KEY not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`LLM API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('LLM API call failed:', error);
      throw error;
    }
  }

  async fetchUserData(userId) {
    const apiBaseUrl = getApiUrl();
    const userData = {};

    try {
      // Fetch user profile from main users table
      const userResponse = await fetch(`${apiBaseUrl}/user/${userId}`);
      if (userResponse.ok) {
        const userBasicData = await userResponse.json();
        userData.basicProfile = userBasicData;
      }
    } catch (error) {
      console.warn('Failed to fetch user basic profile:', error);
    }

    try {
      // Check if user has setup/goals (this tells us if they completed onboarding)
      const setupResponse = await fetch(`${apiBaseUrl}/user/${userId}/setup`);
      if (setupResponse.ok) {
        userData.hasSetup = await setupResponse.json();

        // If user has completed setup, try to get their detailed preferences
        if (userData.hasSetup) {
          try {
            // Try to get user plans which might contain preferences
            const plansResponse = await fetch(`${apiBaseUrl}/plan-creator/plans/${userId}?active_only=true`);
            if (plansResponse.ok) {
              const plansData = await plansResponse.json();
              userData.plans = plansData;

              // Extract preferences from plans if available
              if (plansData?.data?.plans && plansData.data.plans.length > 0) {
                const latestPlan = plansData.data.plans[0];
                userData.profile = this.extractUserPreferencesFromPlan(latestPlan);
              }
            }
          } catch (error) {
            console.warn('Failed to fetch user plans:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch user setup:', error);
    }

    // If no detailed profile found, provide fallback values based on the old service
    if (!userData.profile && userData.hasSetup) {
      userData.profile = {
        risk_tolerance: 'moderate',
        investment_goals: ['long_term_growth'],
        experience_level: 'intermediate',
        age: 35,
        user_tier: userData.basicProfile?.user_tier || 'basic'
      };
    }

    return userData;
  }

  extractUserPreferencesFromPlan(plan) {
    // Extract user preferences from plan data structure
    const preferences = {};

    if (plan.user_preferences) {
      const prefs = plan.user_preferences;
      preferences.risk_tolerance = this.mapRiskTolerance(prefs.risk_tolerance);
      preferences.experience_level = this.mapExperienceLevel(prefs.experience_level);
      preferences.investment_goals = [prefs.primary_goal || 'general_investing'];
      preferences.age = prefs.age;
      preferences.investment_horizon = prefs.investment_horizon;
      preferences.starting_amount = prefs.starting_amount;
    }

    return Object.keys(preferences).length > 0 ? preferences : null;
  }

  mapRiskTolerance(riskValue) {
    if (typeof riskValue === 'number') {
      if (riskValue <= 2) return 'conservative';
      if (riskValue <= 4) return 'moderate';
      if (riskValue <= 6) return 'balanced';
      if (riskValue <= 8) return 'growth';
      return 'aggressive';
    }
    return riskValue || 'moderate';
  }

  mapExperienceLevel(experience) {
    const mapping = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate',
      'Advanced': 'advanced',
      'Expert': 'expert'
    };
    return mapping[experience] || experience?.toLowerCase() || 'intermediate';
  }

  async fetchMarketData() {
    try {
      const [etfData, marketOverview] = await Promise.all([
        dashboardApi.etfs.getAll(false),
        dashboardApi.market.getOverview(false)
      ]);

      return {
        etfs: dashboardApi.formatETFData(etfData),
        market: dashboardApi.formatMarketOverview(marketOverview)
      };
    } catch (error) {
      console.warn('Failed to fetch market data:', error);
      return null;
    }
  }

  formatDataForLLM(userData, marketData) {
    let dataContext = "Current market data: ";

    if (marketData?.market) {
      const { vix, vixChange, treasuryYields, marketRegime } = marketData.market;
      dataContext += `VIX: ${vix || 'N/A'} (${vixChange > 0 ? '+' : ''}${vixChange || 'N/A'}%), `;
      dataContext += `Market regime: ${marketRegime || 'unknown'}, `;
      if (treasuryYields?.tenYear) {
        dataContext += `10Y Treasury: ${treasuryYields.tenYear}%, `;
      }
    }

    if (marketData?.etfs && marketData.etfs.length > 0) {
      dataContext += "Top ETFs: ";
      marketData.etfs.slice(0, 3).forEach(etf => {
        dataContext += `${etf.symbol}: $${etf.price} (${etf.changePercent > 0 ? '+' : ''}${etf.changePercent}%), `;
      });
    }

    let userContext = "";
    if (userData?.profile) {
      const profile = userData.profile;
      userContext = `User profile: `;
      if (profile.risk_tolerance) userContext += `${profile.risk_tolerance} risk tolerance, `;
      if (profile.experience_level) userContext += `${profile.experience_level} experience, `;
      if (profile.investment_goals && profile.investment_goals.length > 0) {
        userContext += `goals: ${profile.investment_goals.join(', ')}, `;
      }
      if (profile.investment_horizon) userContext += `${profile.investment_horizon} horizon. `;
    }

    // Add basic profile info if available
    if (userData?.basicProfile?.user_tier) {
      userContext += `User tier: ${userData.basicProfile.user_tier}. `;
    }

    if (userData?.plans?.data?.plans && userData.plans.data.plans.length > 0) {
      userContext += `Active investment plans: ${userData.plans.data.plans.length}. `;
    }

    return { dataContext: dataContext.trim(), userContext: userContext.trim() };
  }

  async analyzePortfolio(userId) {
    try {
      // Fetch all required data
      const [userData, marketData] = await Promise.all([
        this.fetchUserData(userId),
        this.fetchMarketData()
      ]);

      const { dataContext, userContext } = this.formatDataForLLM(userData, marketData);

      const systemPrompt = `You are a concise financial advisor. Provide portfolio analysis in exactly 30-40 words.
Focus on actionable insights based on current market conditions and user profile.`;

      const userPrompt = `${dataContext}
${userContext}
Analyze this portfolio and provide a brief recommendation.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];

      const analysis = await this.makeAPICall(messages, 60); // Slightly higher token limit for analysis

      return {
        type: 'portfolio_analysis',
        analysis: analysis,
        timestamp: new Date().toISOString(),
        dataUsed: {
          hasUserProfile: !!userData?.profile,
          hasMarketData: !!marketData,
          etfCount: marketData?.etfs?.length || 0
        }
      };
    } catch (error) {
      console.error('Portfolio analysis failed:', error);
      throw new Error('Failed to analyze portfolio. Please try again.');
    }
  }

  async getPersonalizedAdvice(question, userId) {
    try {
      // Fetch all required data
      const [userData, marketData] = await Promise.all([
        this.fetchUserData(userId),
        this.fetchMarketData()
      ]);

      const { dataContext, userContext } = this.formatDataForLLM(userData, marketData);

      const systemPrompt = `You are a financial advisor. Answer the user's question in 30-40 words using current market data and their profile.
Be specific and actionable.`;

      const userPrompt = `Question: ${question}

Context:
${dataContext}
${userContext}

Provide a personalized answer.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];

      const advice = await this.makeAPICall(messages, 60);

      return {
        type: 'personalized_advice',
        advice: advice,
        question: question,
        timestamp: new Date().toISOString(),
        dataUsed: {
          hasUserProfile: !!userData?.profile,
          hasMarketData: !!marketData,
          etfCount: marketData?.etfs?.length || 0
        }
      };
    } catch (error) {
      console.error('Personalized advice failed:', error);
      throw new Error('Failed to get personalized advice. Please try again.');
    }
  }

  // Helper method to check if API is configured
  isConfigured() {
    return !!this.apiKey;
  }

  // Get configuration info
  getConfig() {
    return {
      hasApiKey: !!this.apiKey,
      model: this.model,
      maxTokens: this.maxTokens,
      baseURL: this.baseURL
    };
  }
}

export default new FrontendLLMService();