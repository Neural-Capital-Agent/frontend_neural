import React, { useState } from 'react';
import QuickAdvice from './QuickAnalisis';
import PlanCreator from './PlanCreator';
import AIInvestmentAdvisor from './AIInvestmentAdvisor';
import MarketNews from './MarketNews';
import CompleteAIAnalysis from './CompleteAIAnalysis';
import PortfolioAdvisory from './PortfolioAdvisory';

const DashboardOptions = ({ memberShipData }) => {
    const [activeOption, setActiveOption] = useState(null);

    const dashboardOptions = [
        {
            id: 'quick-advice',
            title: 'Quick Advice',
            description: 'Get instant insights and recommendations for your investments',
            icon: '📊',
            component: <QuickAdvice />,
            tier: 'free'
        },
        {
            id: 'plan-creator',
            title: 'Plan Creator',
            description: 'Create comprehensive investment plans tailored to your goals',
            icon: '📋',
            component: <PlanCreator />,
            tier: 'free'
        },
        {
            id: 'ai-investment-advisor',
            title: 'AI Investment Advisor',
            description: 'Get personalized investment advice powered by advanced AI',
            icon: '🤖',
            component: <AIInvestmentAdvisor />,
            tier: 'free'
        },
        {
            id: 'portfolio-advisor',
            title: 'Portfolio Advisor',
            description: 'Get expert portfolio optimization and asset allocation recommendations (Coming Soon)',
            icon: '💼',
            component: <PortfolioAdvisory />,
            tier: 'premium',
            comingSoon: true
        },
        {
            id: 'market-news',
            title: 'Market News',
            description: 'Stay updated with latest financial news and market developments',
            icon: '📰',
            component: <MarketNews />,
            tier: 'free'
        },
        {
            id: 'complete-ai-analysis',
            title: 'Complete AI Analysis',
            description: 'Comprehensive AI-driven analysis combining all data sources (Coming Soon)',
            icon: '🔬',
            component: <CompleteAIAnalysis />,
            tier: 'premium',
            comingSoon: true
        }
    ];

    const handleOptionClick = (optionId) => {
        const option = dashboardOptions.find(opt => opt.id === optionId);
        if (!canAccessFeature(option.tier, memberShipData?.tier) || option.comingSoon) {
            return;
        }
        if (activeOption === optionId) {
            setActiveOption(null);
        } else {
            setActiveOption(optionId);
        }
    };

    const canAccessFeature = (requiredTier, userTier) => {
        const tierHierarchy = ['free', 'basic', 'premium', 'enterprise'];
        const requiredIndex = tierHierarchy.indexOf(requiredTier);
        const userIndex = tierHierarchy.indexOf(userTier);
        return userIndex >= requiredIndex;
    };

    const getTierBadgeColor = (tier) => {
        switch (tier) {
            case 'free': return 'bg-green-500';
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

            {/* Remove the basic tier warning since all features are now available in basic */}

            {activeOption === null ? (
                <div className="grid grid-cols-3 grid-rows-2 gap-6 max-w-7xl mx-auto">
                    {dashboardOptions.map((option) => {
                        const hasAccess = canAccessFeature(option.tier, memberShipData?.tier);
                        const isComingSoon = option.comingSoon;
                        const isAccessible = hasAccess && !isComingSoon;
                        return (
                            <div
                                key={option.id}
                                className={`bg-[#111726] rounded-xl border border-[#C87933]/30 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#C87933]/20 h-64 flex flex-col justify-between ${
                                    isAccessible ? 'hover:border-[#C87933]/60 hover:scale-105' : 'opacity-60 cursor-not-allowed'
                                }`}
                                onClick={() => handleOptionClick(option.id)}
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-4xl">{option.icon}</div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTierBadgeColor(option.tier)}`}>
                                            {option.tier.toUpperCase()}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#F3ECDC] mb-3">{option.title}</h3>
                                    <p className="text-[#9BA4B5] text-sm leading-relaxed">{option.description}</p>
                                </div>
                                {isComingSoon ? (
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-yellow-400 text-sm font-medium">Coming Soon</span>
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                ) : hasAccess ? (
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-[#C87933] text-sm font-medium">Click to open</span>
                                        <svg className="w-5 h-5 text-[#C87933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-red-400 text-sm font-medium">Upgrade required</span>
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setActiveOption(null)} className="flex items-center space-x-2 text-[#C87933] hover:text-[#C87933]/80 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-[#F3ECDC]">{dashboardOptions.find(opt => opt.id === activeOption)?.title}</h2>
                            <p className="text-[#9BA4B5] text-sm">{dashboardOptions.find(opt => opt.id === activeOption)?.description}</p>
                        </div>
                    </div>
                    <div className="bg-[#111726] rounded-xl border border-[#C87933]/30 overflow-hidden">
                        {dashboardOptions.find(opt => opt.id === activeOption)?.component}
                    </div>
                </div>
            )}

            {memberShipData && (
                <div className="mt-8 bg-[#111726] rounded-xl border border-[#C87933]/30 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-[#F3ECDC]">Current Plan: {memberShipData.tier?.toUpperCase() || 'NO PLAN'}</h3>
                            {memberShipData.credits_remaining !== undefined && (
                                <p className="text-[#9BA4B5]">Credits remaining: {memberShipData.credits_remaining}</p>
                            )}
                        </div>
                        <a href="/pricing" className="bg-[#C87933] hover:bg-[#C87933]/80 text-[#F3ECDC] px-4 py-2 rounded-lg font-medium transition-colors">
                            Upgrade Plan
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOptions;