// Agent API Service for Neural Capital Agent Results
import { getApiUrl } from '../utils/apiConfig.js';

const API_BASE_URL = getApiUrl();

class AgentApiService {
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
      console.error(`Agent API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Parse agent results from text file format
  parseAgentResults(rawText) {
    const results = {
      dataAgent: null,
      portfolioAgent: null,
      plannerAgent: null,
      explainabilityAgent: null,
      timestamp: new Date().toISOString()
    };

    try {
      // Split by agent sections
      const sections = rawText.split('============================================================');

      sections.forEach(section => {
        if (section.includes('Agent 1')) {
          results.dataAgent = this.parseDataAgent(section);
        } else if (section.includes('Agent 2')) {
          results.portfolioAgent = this.parsePortfolioAgent(section);
        } else if (section.includes('Agent 3')) {
          results.plannerAgent = this.parsePlannerAgent(section);
        } else if (section.includes('Agent 4')) {
          results.explainabilityAgent = this.parseExplainabilityAgent(section);
        }
      });
    } catch (error) {
      console.error('Error parsing agent results:', error);
    }

    return results;
  }

  parseDataAgent(section) {
    const marketData = [];
    const macroData = {};

    try {
      // Extract market data responses
      const marketResponses = section.match(/Response: \{[\s\S]*?"data": \{[\s\S]*?\}/g);

      marketResponses?.forEach(response => {
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            if (data.data && data.ticker && !data.indicator) {
              marketData.push({
                symbol: data.data.symbol,
                price: data.data.price,
                previousClose: data.data.previous_close,
                change: data.data.change,
                changePercent: data.data.change_percent,
                timestamp: data.data.timestamp
              });
            }
          }
        } catch (e) {
          console.warn('Failed to parse market response:', e);
        }
      });

      // Extract macro data
      const macroResponses = section.match(/indicator.*?Response: \{[\s\S]*?"data": \[[\s\S]*?\]/g);

      macroResponses?.forEach(response => {
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            if (data.indicator && data.data && Array.isArray(data.data)) {
              const latestValue = data.data[0];
              macroData[data.indicator] = {
                value: latestValue.value,
                date: latestValue.date,
                trend: this.calculateTrend(data.data)
              };
            }
          }
        } catch (e) {
          console.warn('Failed to parse macro response:', e);
        }
      });
    } catch (error) {
      console.error('Error parsing data agent section:', error);
    }

    return { marketData, macroData };
  }

  parsePortfolioAgent(section) {
    const portfolio = {};
    const rebalance = { actions: [] };

    try {
      // Parse portfolio build response
      const portfolioMatch = section.match(/Portfolio build response: \{[\s\S]*?\}/);
      if (portfolioMatch) {
        const data = JSON.parse(portfolioMatch[0].replace('Portfolio build response: ', ''));
        if (data.portfolio && data.portfolio.portfolio) {
          const p = data.portfolio.portfolio;
          portfolio.id = p.id;
          portfolio.allocations = p.allocations;
          portfolio.expectedReturn = p.expected_return;
          portfolio.expectedRisk = p.expected_risk;
          portfolio.sharpeRatio = p.sharpe_ratio;
        }
      }

      // Parse rebalance response
      const rebalanceMatch = section.match(/Rebalance response: \{[\s\S]*?\}/);
      if (rebalanceMatch) {
        const data = JSON.parse(rebalanceMatch[0].replace('Rebalance response: ', ''));
        if (data.rebalance_action && data.rebalance_action.actions) {
          rebalance.actions = data.rebalance_action.actions.map(action => ({
            ticker: action.ticker,
            action: action.action,
            amount: action.amount,
            currentWeight: action.current_weight,
            targetWeight: action.target_weight,
            reason: `${action.action === 'buy' ? 'Increase' : 'Reduce'} position`
          }));
        }
      }
    } catch (error) {
      console.error('Error parsing portfolio agent section:', error);
    }

    return { portfolio, rebalance };
  }

  parsePlannerAgent(section) {
    const goal = {};
    const strategy = {};

    try {
      // Parse goal parsing response
      const goalMatch = section.match(/Goal parsing response: \{[\s\S]*?\}/);
      if (goalMatch) {
        const data = JSON.parse(goalMatch[0].replace('Goal parsing response: ', ''));
        if (data.parsed_goal && data.parsed_goal.parsed_goal) {
          const g = data.parsed_goal.parsed_goal;
          goal.goalType = g.goal_type;
          goal.targetAmount = g.target_amount;
          goal.timeHorizon = g.time_horizon_years;
          goal.currentAge = g.current_age;
          goal.riskLevel = g.risk_level;
          goal.monthlyInvestment = g.monthly_investment;
        }
      }

      // Parse strategy response
      const strategyMatch = section.match(/Strategy response: \{[\s\S]*?\}/);
      if (strategyMatch) {
        const data = JSON.parse(strategyMatch[0].replace('Strategy response: ', ''));
        if (data.strategy && data.strategy.strategy) {
          const s = data.strategy.strategy;
          strategy.allocationType = s.allocation_type;
          strategy.expectedReturn = s.expected_return;
          strategy.confidenceLevel = s.confidence_level;
          strategy.allocation = s.recommended_allocation;
          strategy.riskLevel = s.risk_level;
        }
        if (data.goal) {
          goal.monthlyInvestment = data.goal.monthly_investment || goal.monthlyInvestment;
        }
      }
    } catch (error) {
      console.error('Error parsing planner agent section:', error);
    }

    return { goal, strategy };
  }

  parseExplainabilityAgent(section) {
    const explanation = {};

    try {
      // Parse explanation response
      const explanationMatch = section.match(/Explanation response: \{[\s\S]*?\}/);
      if (explanationMatch) {
        const data = JSON.parse(explanationMatch[0].replace('Explanation response: ', ''));
        if (data.explanation) {
          explanation.summary = data.explanation.summary;
          explanation.riskLevel = data.explanation.risk_assessment?.level || 'unknown';
          explanation.confidence = data.explanation.confidence_score || 0;
          explanation.timestamp = data.timestamp;
        }
      }
    } catch (error) {
      console.error('Error parsing explainability agent section:', error);
    }

    return explanation;
  }

  calculateTrend(dataPoints) {
    if (!dataPoints || dataPoints.length < 2) return 'stable';

    const recent = dataPoints[0].value;
    const previous = dataPoints[1].value;

    if (recent > previous * 1.01) return 'up';
    if (recent < previous * 0.99) return 'down';
    return 'stable';
  }

  // Agent Results Methods
  agents = {
    // Get latest agent results
    getResults: () =>
      this.makeRequest('/agents/results'),

    // Get specific agent results
    getAgentResult: (agentId) =>
      this.makeRequest(`/agents/results/${agentId}`),

    // Trigger agent analysis
    runAnalysis: (params) =>
      this.makeRequest('/agents/analyze', {
        method: 'POST',
        body: JSON.stringify(params)
      }),

    // Load results from file (temporary solution)
    loadFromFile: async () => {
      try {
        // For now, return mock data based on your file structure
        // This would be replaced with actual file reading endpoint
        const response = await fetch('/api/agent-results-file');
        if (response.ok) {
          const rawText = await response.text();
          return this.parseAgentResults(rawText);
        }
        throw new Error('Failed to load agent results file');
      } catch (error) {
        console.error('Error loading agent results from file:', error);
        // Return mock data for development
        return this.getMockResults();
      }
    }
  };

  // Mock data for development
  getMockResults() {
    return {
      dataAgent: {
        marketData: [
          { symbol: 'AAPL', price: 245.5, previousClose: 237.88, change: 7.62, changePercent: 3.20, timestamp: new Date().toISOString() },
          { symbol: 'MSFT', price: 517.93, previousClose: 508.45, change: 9.48, changePercent: 1.86, timestamp: new Date().toISOString() },
          { symbol: 'SPY', price: 663.70, previousClose: 660.429, change: 3.27, changePercent: 0.50, timestamp: new Date().toISOString() },
          { symbol: 'BTC-USD', price: 115767.09, previousClose: 115692.3, change: 74.79, changePercent: 0.06, timestamp: new Date().toISOString() }
        ],
        macroData: {
          GDP: { value: 30353.902, trend: 'up', date: '2025-04-01T00:00:00' },
          INFLATION: { value: 323.976, trend: 'up', date: '2025-08-01T00:00:00' },
          UNEMPLOYMENT: { value: 4.3, trend: 'stable', date: '2025-08-01T00:00:00' },
          INTEREST_RATES: { value: 4.33, trend: 'stable', date: '2025-08-01T00:00:00' }
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
            { ticker: 'SPY', action: 'sell', amount: 0.05, currentWeight: 0.3, targetWeight: 0.25, reason: 'Reduce overweight position' },
            { ticker: 'SHY', action: 'buy', amount: 0.017, currentWeight: 0, targetWeight: 0.017, reason: 'Add short-term bonds' },
            { ticker: 'IEF', action: 'buy', amount: 0.017, currentWeight: 0, targetWeight: 0.017, reason: 'Add intermediate bonds' },
            { ticker: 'GLD', action: 'buy', amount: 0.017, currentWeight: 0, targetWeight: 0.017, reason: 'Add gold exposure' }
          ]
        }
      },
      plannerAgent: {
        goal: {
          goalType: 'child_education',
          targetAmount: 500000,
          timeHorizon: 15,
          currentAge: 40,
          riskLevel: 3,
          monthlyInvestment: 1200
        },
        strategy: {
          allocationType: 'balanced',
          expectedReturn: 0.076,
          confidenceLevel: 'medium',
          allocation: { equities: 0.6, bonds: 0.4 },
          riskLevel: '3'
        }
      },
      explainabilityAgent: {
        summary: "Balanced portfolio allocation optimized for moderate risk tolerance and retirement goals. The recommended strategy diversifies across multiple asset classes including domestic and international equities, bonds of varying durations, and alternative investments like gold to provide stable growth while managing downside risk.",
        riskLevel: 'moderate',
        confidence: 0.3,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }

  // Format agent results for display
  formatResults(rawResults) {
    // Apply any formatting transformations needed for the UI
    return {
      ...rawResults,
      formatted: true,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export singleton instance
const agentApi = new AgentApiService();
export default agentApi;