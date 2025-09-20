import React, { useState } from 'react';
import QuickAdvice from './QuickAnalisis';
import PlanCreator from './PlanCreator';
import PortfolioAdvisory from './PortfolioAdvisory';
import AIMarketAnalysis from './AIMarketAnalysis';
import CompleteAIAnalysis from './CompleteAIAnalysis';

const DashboardOptions = ({ memberShipData }) => {
  const [activeOption, setActiveOption] = useState(null);

  const dashboardOptions = [
    {
      id: 'quick-advice',
      title: 'Quick Advice',
      description: 'Get instant insights and recommendations for your investments',
      icon: '💡',
      component: <QuickAdvice />,
      tier: 'basic'
    },
    {
      id: 'plan-creator',
      title: 'Plan Creator',
      description: 'Create comprehensive investment plans tailored to your goals',
      icon: '📋',
      component: <PlanCreator />,
      tier: 'basic'
    },
    {
      id: 'portfolio-advisory',
      title: 'Portfolio Advisory',
      description: 'Get personalized portfolio recommendations and optimization',
      icon: '📊',
      component: <PortfolioAdvisory />,
      tier: 'premium'
    },
    {
      id: 'ai-market-analysis',
      title: 'AI Market Analysis',
      description: 'Advanced market analysis with AI-powered insights',
      icon: '📈',
      component: <AIMarketAnalysis />,
      tier: 'premium'
    },
    {
      id: 'complete-ai-analysis',
      title: 'Complete AI Analysis',
      description: 'Comprehensive AI-driven analysis combining all data sources',
      icon: '🧠',
      component: <CompleteAIAnalysis />,
      tier: 'enterprise'
    }
  ];

  const handleOptionClick = (optionId) => {
    const option = dashboardOptions.find(opt => opt.id === optionId);

    // Check tier access
    if (!canAccessFeature(option.tier, memberShipData?.tier)) {
      return;
    }

    if (activeOption === optionId) {
      setActiveOption(null);
    } else {
      setActiveOption(optionId);
    }
  };

  const canAccessFeature = (requiredTier, userTier) => {
    const tierHierarchy = ['basic', 'premium', 'enterprise'];
    const requiredIndex = tierHierarchy.indexOf(requiredTier);
    const userIndex = tierHierarchy.indexOf(userTier);
    return userIndex >= requiredIndex;
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'enterprise': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[2px] text-[#F3ECDC] mb-2">
          AI Financial Dashboard
        </h1>
        <p className="text-lg text-[#9BA4B5]">
          Choose from our suite of AI-powered financial tools and analysis
        </p>
      </div>

      {/* Dashboard Options Grid */}
      {activeOption === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardOptions.map((option) => {
            const hasAccess = canAccessFeature(option.tier, memberShipData?.tier);

            return (
              <div
                key={option.id}
                className={`bg-[#111726] rounded-xl border border-[#C87933]/30 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#C87933]/20 ${
                  hasAccess
                    ? 'hover:border-[#C87933]/60 hover:scale-105'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleOptionClick(option.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTierBadgeColor(option.tier)}`}>
                    {option.tier.toUpperCase()}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#F3ECDC] mb-2">
                  {option.title}
                </h3>

                <p className="text-[#9BA4B5] text-sm mb-4 line-clamp-2">
                  {option.description}
                </p>

                {hasAccess ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[#C87933] text-sm font-medium">
                      Click to open
                    </span>
                    <svg
                      className="w-5 h-5 text-[#C87933]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm font-medium">
                      Upgrade required
                    </span>
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Show active component
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveOption(null)}
              className="flex items-center space-x-2 text-[#C87933] hover:text-[#C87933]/80 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Dashboard</span>
            </button>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-[#F3ECDC]">
                {dashboardOptions.find(opt => opt.id === activeOption)?.title}
              </h2>
              <p className="text-[#9BA4B5] text-sm">
                {dashboardOptions.find(opt => opt.id === activeOption)?.description}
              </p>
            </div>
          </div>

          <div className="bg-[#111726] rounded-xl border border-[#C87933]/30 overflow-hidden">
            {dashboardOptions.find(opt => opt.id === activeOption)?.component}
          </div>
        </div>
      )}

      {/* Tier Status Display */}
      {memberShipData && (
        <div className="mt-8 bg-[#111726] rounded-xl border border-[#C87933]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#F3ECDC]">
                Current Plan: {memberShipData.tier?.toUpperCase() || 'NO PLAN'}
              </h3>
              {memberShipData.credits_remaining !== undefined && (
                <p className="text-[#9BA4B5]">
                  Credits remaining: {memberShipData.credits_remaining}
                </p>
              )}
            </div>
            <a
              href="/pricing"
              className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Upgrade Plan
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOptions;