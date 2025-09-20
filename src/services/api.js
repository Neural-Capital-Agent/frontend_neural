// API Service for Neural Capital Financial Agents
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
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
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Data Agent endpoints
  dataAgent = {
    // Get market data
    getMarketData: (symbol, period = '1d') =>
      this.makeRequest(`/agents/data/market-data?symbol=${symbol}&period=${period}`),

    // Get economic indicators
    getEconomicIndicators: () =>
      this.makeRequest('/agents/data/economic-indicators'),

    // Get technical analysis
    getTechnicalAnalysis: (symbol) =>
      this.makeRequest(`/agents/data/technical-analysis?symbol=${symbol}`),

    // Get macro indicators
    getMacroIndicators: () =>
      this.makeRequest('/agents/data/macro-indicators'),
  };

  // Portfolio Agent endpoints
  portfolioAgent = {
    // Optimize portfolio
    optimizePortfolio: (portfolioData) =>
      this.makeRequest('/agents/portfolio/optimize', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      }),

    // Get risk analysis
    getRiskAnalysis: (portfolioData) =>
      this.makeRequest('/agents/portfolio/risk-analysis', {
        method: 'POST',
        body: JSON.stringify(portfolioData),
      }),
  };

  // Planner Agent endpoints
  plannerAgent = {
    // Parse financial goal
    parseGoal: (goalText, userId) =>
      this.makeRequest(`/agents/planner/parse-goal?goal_text=${encodeURIComponent(goalText)}&user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
      }),

    // Create investment plan
    createPlan: (planData) =>
      this.makeRequest('/agents/planner/create-plan', {
        method: 'POST',
        body: JSON.stringify(planData),
      }),

    // Get lifecycle planning
    getLifecyclePlan: (userData) =>
      this.makeRequest('/agents/planner/lifecycle-plan', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  };

  // Explainer Agent endpoints
  explainerAgent = {
    // Explain financial decision
    explainDecision: (decisionData) =>
      this.makeRequest('/agents/explainer/explain-decision', {
        method: 'POST',
        body: JSON.stringify(decisionData),
      }),

    // Translate financial jargon
    translateJargon: (text) =>
      this.makeRequest('/agents/explainer/translate-jargon', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),

    // Get risk explanation
    explainRisk: (riskData) =>
      this.makeRequest('/agents/explainer/explain-risk', {
        method: 'POST',
        body: JSON.stringify(riskData),
      }),
  };

  // CrewAI Workflows
  crewAI = {
    // Market analysis workflow
    marketAnalysis: (analysisData) =>
      this.makeRequest('/crew/market-analysis', {
        method: 'POST',
        body: JSON.stringify(analysisData),
      }),

    // Portfolio advisory workflow
    portfolioAdvisory: (advisoryData) =>
      this.makeRequest('/crew/portfolio-advisory', {
        method: 'POST',
        body: JSON.stringify(advisoryData),
      }),

    // Quick advice workflow
    quickAdvice: (query) =>
      this.makeRequest('/crew/quick-advice', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),

    // Get workflow status
    getStatus: () =>
      this.makeRequest('/crew/status'),
  };

  // Dashboard data endpoints
  dashboard = {
    // ETF data
    getETFs: (refresh = false) =>
      this.makeRequest(`/dashboard/etfs?refresh=${refresh}`),

    getETF: (symbol, refresh = false) =>
      this.makeRequest(`/dashboard/etfs/${symbol}?refresh=${refresh}`),

    // Market overview
    getMarketOverview: (refresh = false) =>
      this.makeRequest(`/dashboard/market-overview?refresh=${refresh}`),

    // Complete dashboard data
    getDashboardData: (userId = null, refresh = false) => {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (refresh) params.append('refresh', 'true');
      return this.makeRequest(`/dashboard/?${params.toString()}`);
    },

    // Refresh all data
    refreshData: () =>
      this.makeRequest('/dashboard/refresh', { method: 'POST' }),

    // Technical indicators
    getTechnicalIndicators: (symbol, period = '1y') =>
      this.makeRequest(`/dashboard/technical-indicators/${symbol}?period=${period}`),

    // User watchlist
    saveWatchlist: (userId, symbols) =>
      this.makeRequest(`/dashboard/watchlist/${userId}`, {
        method: 'POST',
        body: JSON.stringify(symbols),
      }),
  };

  // Health checks
  health = {
    system: () => this.makeRequest('/health'),
    agents: () => this.makeRequest('/agents/health'),
    crew: () => this.makeRequest('/crew/health'),
  };
}

export default new ApiService();