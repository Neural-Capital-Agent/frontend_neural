import { useState, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook for Data Agent operations
export const useDataAgent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMarketData = useCallback(async (symbol, period = '1d') => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.dataAgent.getMarketData(symbol, period);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTechnicalAnalysis = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.dataAgent.getTechnicalAnalysis(symbol);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEconomicIndicators = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.dataAgent.getEconomicIndicators();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMarketData,
    getTechnicalAnalysis,
    getEconomicIndicators,
  };
};

// Custom hook for Portfolio Agent operations
export const usePortfolioAgent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const optimizePortfolio = useCallback(async (portfolioData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.portfolioAgent.optimizePortfolio(portfolioData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskAnalysis = useCallback(async (portfolioData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.portfolioAgent.getRiskAnalysis(portfolioData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    optimizePortfolio,
    getRiskAnalysis,
  };
};

// Custom hook for Planner Agent operations
export const usePlannerAgent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseGoal = useCallback(async (goalText, userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.plannerAgent.parseGoal(goalText, userId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (planData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.plannerAgent.createPlan(planData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    parseGoal,
    createPlan,
  };
};

// Custom hook for Explainer Agent operations
export const useExplainerAgent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const explainDecision = useCallback(async (decisionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.explainerAgent.explainDecision(decisionData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const translateJargon = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.explainerAgent.translateJargon(text);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    explainDecision,
    translateJargon,
  };
};

// Custom hook for CrewAI workflows
export const useCrewAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickAdvice = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.crewAI.quickAdvice(query);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const marketAnalysis = useCallback(async (analysisData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.crewAI.marketAnalysis(analysisData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const portfolioAdvisory = useCallback(async (advisoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.crewAI.portfolioAdvisory(advisoryData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    quickAdvice,
    marketAnalysis,
    portfolioAdvisory,
  };
};