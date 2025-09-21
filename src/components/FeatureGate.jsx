import React from 'react';
import { useFeatureAccess } from '../hooks/useTier';

/**
 * FeatureGate Component
 * Controls access to features based on user tier and usage limits
 */
const FeatureGate = ({
  featureName,
  userId,
  children,
  fallback = null,
  showUpgradePrompt = true,
  className = "",
  upgradeAction = null
}) => {
  const { hasAccess, hasUsage, isLocked, upgradeMessage, tierData } = useFeatureAccess(featureName, userId);

  // If feature is accessible, render children
  if (hasAccess && hasUsage) {
    return <div className={className}>{children}</div>;
  }

  // If fallback is provided and feature is locked, show fallback
  if (fallback && isLocked) {
    return <div className={className}>{fallback}</div>;
  }

  // Show upgrade prompt by default
  if (showUpgradePrompt && isLocked) {
    return (
      <div className={`${className} feature-gate-locked`}>
        <FeatureLockedPrompt
          featureName={featureName}
          upgradeMessage={upgradeMessage}
          currentTier={tierData?.tier}
          upgradeAction={upgradeAction}
        />
      </div>
    );
  }

  // Don't render anything if no fallback and no upgrade prompt
  return null;
};

/**
 * Feature Locked Prompt Component
 */
const FeatureLockedPrompt = ({ featureName, upgradeMessage, currentTier, upgradeAction }) => {
  const handleUpgradeClick = () => {
    if (upgradeAction) {
      upgradeAction();
    } else {
      // Default action: navigate to pricing page
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 text-center">
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-600 mb-4">
          {upgradeMessage}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUpgradeClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Upgrade Now
          </button>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Current plan: <span className="font-medium capitalize">{currentTier}</span>
      </div>
    </div>
  );
};

/**
 * Inline Feature Gate for smaller UI elements
 */
export const InlineFeatureGate = ({
  featureName,
  userId,
  children,
  lockedContent = null,
  showTooltip = true
}) => {
  const { hasAccess, hasUsage, isLocked, upgradeMessage } = useFeatureAccess(featureName, userId);

  if (hasAccess && hasUsage) {
    return children;
  }

  if (lockedContent) {
    return lockedContent;
  }

  // Default locked state - disabled button with tooltip
  return (
    <div className="relative group">
      <div className="opacity-50 cursor-not-allowed">
        {React.cloneElement(children, { disabled: true, onClick: () => {} })}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {upgradeMessage}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Feature Badge Component - shows tier requirement
 */
export const FeatureBadge = ({ featureName, requiredTier = "premium" }) => {
  const tierColors = {
    basic: "bg-blue-100 text-blue-800",
    premium: "bg-purple-100 text-purple-800",
    enterprise: "bg-yellow-100 text-yellow-800"
  };

  const tierIcons = {
    basic: "⭐",
    premium: "💎",
    enterprise: "👑"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tierColors[requiredTier] || tierColors.premium}`}>
      <span className="mr-1">{tierIcons[requiredTier] || "💎"}</span>
      {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
    </span>
  );
};

/**
 * Credits Display Component
 */
export const CreditsDisplay = ({ userId, showRefresh = true }) => {
  const { tierData, refreshTier } = useFeatureAccess(null, userId);

  if (!tierData) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  const handleRefresh = async () => {
    try {
      await refreshTier();
    } catch (error) {
      console.error('Error refreshing tier data:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Credits:</span>
      <span className="font-medium">
        {tierData.credits_remaining === -1 ? '∞' : tierData.credits_remaining}
      </span>
      {showRefresh && (
        <button
          onClick={handleRefresh}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh credits"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FeatureGate;