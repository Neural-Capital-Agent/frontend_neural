// Custom hook for tier management
import { useState, useEffect, useCallback } from 'react';
import tierService from '../services/tierService';

export const useTier = (userId) => {
  const [tierData, setTierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize tier monitoring
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const initializeTier = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize tier monitoring
        const initialTierData = await tierService.initializeTierMonitoring(userId);
        setTierData(initialTierData);
      } catch (err) {
        console.error('Error initializing tier:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeTier();

    // Set up tier change listener
    const unsubscribe = tierService.addTierListener((newTierData) => {
      setTierData(newTierData);
    });

    // Cleanup on unmount or userId change
    return () => {
      unsubscribe();
      if (userId) {
        tierService.cleanup();
      }
    };
  }, [userId]);

  // Check feature access
  const hasFeatureAccess = useCallback((featureName) => {
    return tierService.hasFeatureAccess(featureName);
  }, []);

  // Check usage remaining
  const hasUsageRemaining = useCallback((featureName = null) => {
    return tierService.hasUsageRemaining(featureName);
  }, []);

  // Get tier display info
  const getTierDisplayInfo = useCallback(() => {
    return tierService.getTierDisplayInfo();
  }, []);

  // Refresh tier data
  const refreshTier = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const refreshedData = await tierService.refreshTierData();
      setTierData(refreshedData);

      return refreshedData;
    } catch (err) {
      console.error('Error refreshing tier:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if feature should be locked
  const isFeatureLocked = useCallback((featureName) => {
    // During loading or if tier data fails to load, allow free tier features by default
    if (!tierData) {
      const freeTierFeatures = ['ai_analysis', 'portfolio_optimization', 'real_time_data', 'chat_support'];
      return !freeTierFeatures.includes(featureName);
    }

    const hasAccess = hasFeatureAccess(featureName);
    const hasUsage = hasUsageRemaining(featureName);

    return !hasAccess || !hasUsage;
  }, [tierData, hasFeatureAccess, hasUsageRemaining]);

  // Get upgrade message for locked features
  const getUpgradeMessage = useCallback((featureName) => {
    if (!tierData) return 'Loading tier information...';

    const currentTier = tierData.tier;
    const requiredTiers = {
      'ai_analysis': 'free',
      'portfolio_optimization': 'free',
      'real_time_data': 'free',
      'advanced_charts': 'free',
      'chat_support': 'free',
      'api_access': 'free',
      'monte_carlo': 'free',
      'stress_testing': 'free',
      'custom_reports': 'free',
      'priority_support': 'free'
    };

    const requiredTier = requiredTiers[featureName] || 'free';

    // Since all features are now available to free tier users,
    // only show upgrade messages if they're out of usage
    if (!hasUsageRemaining()) {
      return 'You have reached your usage limit. Upgrade your plan for higher limits.';
    }

    // All users should have access to all features now
    return 'Feature temporarily unavailable';
  }, [tierData, hasUsageRemaining]);

  // Simulate tier change (for testing)
  const simulateTierChange = useCallback(async (newTier) => {
    try {
      await tierService.simulateTierChange(newTier);
      return true;
    } catch (err) {
      console.error('Error simulating tier change:', err);
      setError(err.message);
      return false;
    }
  }, []);

  return {
    // State
    tierData,
    loading,
    error,

    // Computed values
    tier: tierData?.tier || 'free',
    creditsRemaining: tierData?.credits_remaining || 0,
    tierDisplayInfo: getTierDisplayInfo(),

    // Functions
    hasFeatureAccess,
    hasUsageRemaining,
    isFeatureLocked,
    getUpgradeMessage,
    refreshTier,
    simulateTierChange,

    // Utilities
    getTierLevel: tierService.getTierLevel.bind(tierService),
    getDefaultFeatures: tierService.getDefaultFeatures.bind(tierService)
  };
};

// Hook for feature-specific access
export const useFeatureAccess = (featureName, userId) => {
  const { hasFeatureAccess, hasUsageRemaining, isFeatureLocked, getUpgradeMessage, tierData } = useTier(userId);

  return {
    hasAccess: hasFeatureAccess(featureName),
    hasUsage: hasUsageRemaining(featureName),
    isLocked: isFeatureLocked(featureName),
    upgradeMessage: getUpgradeMessage(featureName),
    tierData
  };
};

// Hook for tier display components
export const useTierDisplay = (userId) => {
  const { tierData, tierDisplayInfo, loading, error } = useTier(userId);

  return {
    tierData,
    displayInfo: tierDisplayInfo,
    loading,
    error,
    isActive: !!tierData,
    tierName: tierDisplayInfo?.name || 'Free',
    tierIcon: tierDisplayInfo?.icon || '🆓',
    tierColor: tierDisplayInfo?.color || 'gray'
  };
};