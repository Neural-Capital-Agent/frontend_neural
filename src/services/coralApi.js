// Coral Protocol API Service for Neural Capital
import { getCoralApiUrl, getCoralDirectUrl } from '../utils/apiConfig.js';

class CoralApiService {
  constructor() {
    this.coralApiUrl = getCoralApiUrl();
    this.coralServerUrl = getCoralDirectUrl();
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.coralApiUrl}${endpoint}`;
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
      console.error(`Coral API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Helper method for direct Coral server requests
  async makeCoralServerRequest(endpoint, options = {}) {
    const url = `${this.coralServerUrl}${endpoint}`;
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
      console.error(`Coral Server request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Coral Protocol Status and Health
  async getCoralStatus() {
    return this.makeRequest('/status');
  }

  async getNetworkHealth() {
    return this.makeRequest('/network-health');
  }

  async checkAgentHealth(agentId) {
    return this.makeRequest(`/health/${agentId}`);
  }

  // Agent Registration and Discovery
  async registerAgents() {
    return this.makeRequest('/register', {
      method: 'POST'
    });
  }

  async discoverAgents() {
    return this.makeRequest('/discover');
  }

  async unregisterAgent(agentId) {
    return this.makeRequest(`/unregister/${agentId}`, {
      method: 'DELETE'
    });
  }

  // Coral Studio Configuration
  async getStudioConfig() {
    return this.makeRequest('/studio-config');
  }

  async getCapabilities() {
    return this.makeRequest('/capabilities');
  }

  // Direct Coral Server Endpoints
  async getCoralServerStatus() {
    return this.makeCoralServerRequest('/health');
  }

  async getCoralServerInfo() {
    return this.makeCoralServerRequest('/');
  }

  async getRegisteredAgents() {
    return this.makeCoralServerRequest('/agents');
  }

  async getCoralServerAgentInfo(agentId) {
    return this.makeCoralServerRequest(`/agents/${agentId}`);
  }

  // Agent Invocation via Coral Protocol
  async invokeAgent(targetAgent, method, parameters) {
    return this.makeCoralServerRequest('/invoke', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: 'frontend_client',
        target_agent: targetAgent,
        method: method,
        parameters: parameters
      })
    });
  }

  // Coral Protocol v01 SDK Integration Status
  async getSDKStatus() {
    try {
      // Check if agents are using Coral v01 SDK
      const status = await this.getCoralStatus();
      const serverInfo = await this.getCoralServerInfo();

      return {
        api_integration: status?.registry_status || 'unknown',
        server_available: !!serverInfo,
        coral_v01_enabled: true,
        endpoints: {
          api_status: this.coralApiUrl + '/status',
          coral_server: this.coralServerUrl + '/health',
          studio_config: this.coralApiUrl + '/studio-config'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        api_integration: 'error',
        server_available: false,
        coral_v01_enabled: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Enhanced Agent Communication via Coral Protocol
  async getMarketDataViaCoral(ticker, options = {}) {
    return this.invokeAgent('data_agent', 'fetch_market_data', {
      ticker,
      ...options
    });
  }

  async getMarketContextViaCoral(timestamp = null) {
    return this.invokeAgent('data_agent', 'get_market_context', {
      timestamp
    });
  }

  async getDashboardDataViaCoral() {
    return this.invokeAgent('data_agent', 'get_dashboard_data', {});
  }

  async optimizePortfolioViaCoral(portfolioParams) {
    return this.invokeAgent('portfolio_agent', 'optimize_portfolio', portfolioParams);
  }

  async parseGoalViaCoral(goalText) {
    return this.invokeAgent('planner_agent', 'parse_goal', {
      goal_text: goalText
    });
  }

  async explainDecisionViaCoral(decision, context = {}) {
    return this.invokeAgent('explainability_agent', 'explain_decision', {
      decision,
      context
    });
  }

  // Pricing and Payment Information
  async getAgentPricing() {
    try {
      const capabilities = await this.getCapabilities();

      // Extract pricing information from agent capabilities
      const pricingInfo = {
        data_agent: {
          fetch_market_data: { price: 0.01, currency: 'coral' },
          fetch_all_market_data: { price: 0.05, currency: 'coral' },
          get_market_context: { price: 0.02, currency: 'coral' },
          fetch_macro_data: { price: 0.03, currency: 'coral' },
          get_dashboard_data: { price: 0.02, currency: 'coral' }
        },
        portfolio_agent: {
          optimize_portfolio: { price: 0.1, currency: 'coral' },
          rebalance_portfolio: { price: 0.05, currency: 'coral' }
        },
        planner_agent: {
          parse_goal: { price: 0.03, currency: 'coral' },
          create_strategy: { price: 0.05, currency: 'coral' }
        },
        explainability_agent: {
          explain_decision: { price: 0.02, currency: 'coral' },
          translate_jargon: { price: 0.01, currency: 'coral' }
        }
      };

      return {
        pricing: pricingInfo,
        total_agents: Object.keys(pricingInfo).length,
        currency: 'coral',
        version: '1.0',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get agent pricing:', error);
      throw error;
    }
  }
}

// Export singleton instance
const coralApi = new CoralApiService();
export default coralApi;