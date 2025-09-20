import { useState, useEffect, useCallback } from 'react';
import dashboardApi from '../services/dashboardApi';

// Custom hook for dashboard ETF data
export const useDashboardData = (autoRefresh = false, refreshInterval = 60000) => {
  const [data, setData] = useState({
    etfs: [],
    market: {},
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load dashboard data
  const loadData = useCallback(async (refresh = false) => {
    try {
      setIsRefreshing(refresh);
      if (!refresh) {
        setData(prev => ({ ...prev, loading: true, error: null }));
      }

      const summary = await dashboardApi.getDashboardSummary(null, refresh);

      setData({
        etfs: summary.etfs,
        market: summary.market,
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
  const refreshData = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Get specific ETF data
  const getETF = useCallback(async (symbol, refresh = false) => {
    try {
      const response = await dashboardApi.etfs.getOne(symbol, refresh);
      return response.data;
    } catch (error) {
      console.error(`Error getting ETF ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Get technical indicators for ETF
  const getTechnicalIndicators = useCallback(async (symbol, period = '1y') => {
    try {
      const response = await dashboardApi.etfs.getTechnicalIndicators(symbol, period);
      return response.data;
    } catch (error) {
      console.error(`Error getting technical indicators for ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const cleanup = dashboardApi.startRealTimeUpdates(
      (summary) => {
        setData(prev => ({
          ...prev,
          etfs: summary.etfs,
          market: summary.market,
          lastUpdate: new Date(),
        }));
      },
      refreshInterval
    );

    return cleanup;
  }, [autoRefresh, refreshInterval]);

  return {
    ...data,
    isRefreshing,
    refreshData,
    getETF,
    getTechnicalIndicators,
    reload: () => loadData(false),
  };
};

// Custom hook for individual ETF data
export const useETFData = (symbol, autoRefresh = false) => {
  const [etfData, setETFData] = useState({
    data: null,
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const loadETFData = useCallback(async (refresh = false) => {
    try {
      setETFData(prev => ({ ...prev, loading: true, error: null }));

      const response = await dashboardApi.etfs.getOne(symbol, refresh);
      const technicalData = await dashboardApi.etfs.getTechnicalIndicators(symbol);

      setETFData({
        data: {
          ...response.data,
          technicalIndicators: technicalData.data,
        },
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error(`Error loading ETF data for ${symbol}:`, error);
      setETFData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      loadETFData();
    }
  }, [symbol, loadETFData]);

  useEffect(() => {
    if (!autoRefresh || !symbol) return;

    const interval = setInterval(() => {
      loadETFData(true);
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, symbol, loadETFData]);

  return {
    ...etfData,
    refresh: () => loadETFData(true),
    reload: () => loadETFData(false),
  };
};

// Custom hook for market overview
export const useMarketOverview = (autoRefresh = false) => {
  const [marketData, setMarketData] = useState({
    data: {},
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const loadMarketData = useCallback(async (refresh = false) => {
    try {
      setMarketData(prev => ({ ...prev, loading: true, error: null }));

      const response = await dashboardApi.market.getOverview(refresh);
      const formatted = dashboardApi.formatMarketOverview(response);

      setMarketData({
        data: formatted,
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    } catch (error) {
      console.error('Error loading market overview:', error);
      setMarketData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadMarketData(true);
    }, 120000); // Refresh every 2 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, loadMarketData]);

  return {
    ...marketData,
    refresh: () => loadMarketData(true),
    reload: () => loadMarketData(false),
  };
};