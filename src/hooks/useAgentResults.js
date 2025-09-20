import { useState, useEffect, useCallback } from 'react';
import agentApi from '../services/agentApi';

// Custom hook for agent results data
export const useAgentResults = (autoRefresh = false, refreshInterval = 60000) => {
  const [data, setData] = useState({
    results: null,
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load agent results data
  const loadResults = useCallback(async (refresh = false) => {
    try {
      setIsRefreshing(refresh);
      if (!refresh) {
        setData(prev => ({ ...prev, loading: true, error: null }));
      }

      // Try to load from API first, fall back to mock data
      let results;
      try {
        results = await agentApi.agents.getResults();
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        results = await agentApi.agents.loadFromFile();
      }

      setData({
        results: agentApi.formatResults(results),
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error loading agent results:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Refresh data from live sources
  const refreshResults = useCallback(() => {
    return loadResults(true);
  }, [loadResults]);

  // Get specific agent result
  const getAgentResult = useCallback(async (agentId) => {
    try {
      const response = await agentApi.agents.getAgentResult(agentId);
      return response.data;
    } catch (error) {
      console.error(`Error getting agent ${agentId} result:`, error);
      throw error;
    }
  }, []);

  // Run new agent analysis
  const runAnalysis = useCallback(async (params) => {
    try {
      setIsRefreshing(true);
      const response = await agentApi.agents.runAnalysis(params);

      // Refresh results after analysis
      await loadResults(false);

      return response.data;
    } catch (error) {
      console.error('Error running agent analysis:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [loadResults]);

  // Initial load
  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshResults();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshResults]);

  return {
    ...data,
    isRefreshing,
    refreshResults,
    getAgentResult,
    runAnalysis,
  };
};

// Hook for specific agent data
export const useDataAgent = () => {
  const { results, loading, error, refreshResults } = useAgentResults();

  return {
    data: results?.dataAgent || null,
    loading,
    error,
    refresh: refreshResults,
  };
};

export const usePortfolioAgent = () => {
  const { results, loading, error, refreshResults } = useAgentResults();

  return {
    data: results?.portfolioAgent || null,
    loading,
    error,
    refresh: refreshResults,
  };
};

export const usePlannerAgent = () => {
  const { results, loading, error, refreshResults } = useAgentResults();

  return {
    data: results?.plannerAgent || null,
    loading,
    error,
    refresh: refreshResults,
  };
};

export const useExplainabilityAgent = () => {
  const { results, loading, error, refreshResults } = useAgentResults();

  return {
    data: results?.explainabilityAgent || null,
    loading,
    error,
    refresh: refreshResults,
  };
};