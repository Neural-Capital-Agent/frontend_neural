// Enhanced Explainability Agent Service for Profile-Based Quick Advice
const API_BASE_URL = `${(import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8000'}/api/v1`;

class ExplainabilityAgentService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log(`Making Explainability Agent request to: ${url}`, options.body ? JSON.parse(options.body) : 'No body');

      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Explainability Agent request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get user profile data
  async getUserProfile(userId) {
    try {
      return await this.makeRequest(`/users/${userId}/profile`);
    } catch (error) {
      console.warn('User profile not found, using default profile');
      return {
        id: userId,
        name: 'User',
        risk_tolerance: 'moderate',
        investment_goals: ['long_term_growth'],
        age: 35,
        income: 'middle_income',
        experience_level: 'intermediate'
      };
    }
  }

  // Get user portfolio data
  async getUserPortfolio(userId) {
    try {
      return await this.makeRequest(`/users/${userId}/portfolio`);
    } catch (error) {
      console.warn('User portfolio not found, using empty portfolio');
      return {
        holdings: [],
        total_value: 0,
        cash_balance: 0,
        allocation: {}
      };
    }
  }

  // Enhanced quick advice with user context
  async getPersonalizedAdvice(question, userId) {
    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new Error('Question is required and must be a non-empty string');
    }

    if (!userId) {
      throw new Error('User ID is required for personalized advice');
    }

    try {
      // Gather user context in parallel
      const [userProfile, userPortfolio] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserPortfolio(userId)
      ]);

      // Prepare the enhanced request with user context
      const requestData = {
        question: question.trim(),
        user_context: {
          profile: userProfile,
          portfolio: userPortfolio,
          timestamp: new Date().toISOString()
        },
        llm_model: 'mistral', // Specify Mistral as the LLM
        task_type: 'personalized_advice',
        include_explanations: true
      };

      return await this.makeRequest('/explainer/personalized-advice', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

    } catch (error) {
      console.error('Error getting personalized advice:', error);
      throw error;
    }
  }

  // Explain investment recommendation based on user profile
  async explainRecommendation(recommendation, userId) {
    try {
      const userProfile = await this.getUserProfile(userId);

      const requestData = {
        recommendation,
        user_profile: userProfile,
        llm_model: 'mistral',
        explanation_depth: 'detailed'
      };

      return await this.makeRequest('/explainer/explain-recommendation', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

    } catch (error) {
      console.error('Error explaining recommendation:', error);
      throw error;
    }
  }

  // Analyze user portfolio and provide insights
  async analyzePortfolioForUser(userId) {
    try {
      const [userProfile, userPortfolio] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserPortfolio(userId)
      ]);

      const requestData = {
        portfolio: userPortfolio,
        user_profile: userProfile,
        llm_model: 'mistral',
        analysis_type: 'comprehensive'
      };

      return await this.makeRequest('/explainer/portfolio-analysis', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      throw error;
    }
  }

  // Get contextual risk explanation based on user profile
  async explainRiskForUser(riskData, userId) {
    try {
      const userProfile = await this.getUserProfile(userId);

      const requestData = {
        risk_data: riskData,
        user_profile: userProfile,
        llm_model: 'mistral',
        explanation_style: userProfile.experience_level || 'intermediate'
      };

      return await this.makeRequest('/explainer/risk-explanation', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

    } catch (error) {
      console.error('Error explaining risk:', error);
      throw error;
    }
  }

  // Generate personalized educational content
  async generateEducationalContent(topic, userId) {
    try {
      const userProfile = await this.getUserProfile(userId);

      const requestData = {
        topic,
        user_profile: userProfile,
        llm_model: 'mistral',
        content_type: 'educational',
        complexity_level: userProfile.experience_level || 'intermediate'
      };

      return await this.makeRequest('/explainer/educational-content', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

    } catch (error) {
      console.error('Error generating educational content:', error);
      throw error;
    }
  }

  // Health check for explainability agent
  async healthCheck() {
    try {
      return await this.makeRequest('/explainer/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

export default new ExplainabilityAgentService();