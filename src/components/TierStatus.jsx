import React, { useEffect, useState } from 'react';
import MarketTools from './MarketTools';
import { useTierDisplay } from '../hooks/useTier';
import FeatureGate, { CreditsDisplay, FeatureBadge } from './FeatureGate';

const TierStatus = ({ memberShipData, userId }) => {
    const { tierData, displayInfo, loading, error } = useTierDisplay(userId);
    const [showTierChange, setShowTierChange] = useState(false);

    // Listen for tier changes
    useEffect(() => {
        const handleTierChange = (event) => {
            setShowTierChange(true);
            setTimeout(() => setShowTierChange(false), 5000);
        };

        window.addEventListener('tierChanged', handleTierChange);
        return () => window.removeEventListener('tierChanged', handleTierChange);
    }, []);

    // Use real-time tier data if available, fallback to props
    const currentTierData = tierData || memberShipData;

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (error) {
        console.error('Tier Status Error:', error);
        // Fallback to original component if error
        return <OriginalTierStatus memberShipData={memberShipData} />;
    }

    if (!currentTierData) {
        return <NoActivePlan />;
    }

    const tier = currentTierData.tier || 'free';
    const credits = currentTierData.credits_remaining || 0;

    // Tier change notification
    const TierChangeNotification = () => (
        showTierChange && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
                🎉 Your plan has been updated!
            </div>
        )
    );

    // Premium/Enterprise users - minimal display
    if (tier === 'premium' || tier === 'enterprise') {
        return (
            <div className="space-y-4">
                <TierChangeNotification />
                <PremiumTierDisplay
                    tierData={currentTierData}
                    displayInfo={displayInfo}
                    userId={userId}
                />
            </div>
        );
    }

    // Basic tier users
    if (tier === 'basic') {
        return (
            <div className="space-y-4">
                <TierChangeNotification />
                <BasicTierDisplay
                    tierData={currentTierData}
                    displayInfo={displayInfo}
                    userId={userId}
                />
                <MarketTools typeTier={tier} />
            </div>
        );
    }

    // Free tier users
    return (
        <div className="space-y-4">
            <TierChangeNotification />
            <FreeTierDisplay
                tierData={currentTierData}
                displayInfo={displayInfo}
                userId={userId}
            />
            <MarketTools typeTier={tier} />
        </div>
    );
};

// Premium/Enterprise Tier Display
const PremiumTierDisplay = ({ tierData, displayInfo, userId }) => (
    <div className={`${displayInfo?.bgColor} border-l-4 ${displayInfo?.borderColor} p-4 rounded-lg`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{displayInfo?.icon}</span>
                <div>
                    <h3 className={`font-bold ${displayInfo?.textColor}`}>
                        {displayInfo?.name} Plan Active
                    </h3>
                    <p className="text-sm text-gray-600">
                        Access to all features and unlimited analysis
                    </p>
                </div>
            </div>
            <div className="text-right">
                <CreditsDisplay userId={userId} showRefresh={false} />
                {tierData.expires_at && (
                    <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(tierData.expires_at).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    </div>
);

// Basic Tier Display
const BasicTierDisplay = ({ tierData, displayInfo, userId }) => (
    <div className="space-y-4">
        <div className={`${displayInfo?.bgColor} border-l-4 ${displayInfo?.borderColor} p-4 rounded-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{displayInfo?.icon}</span>
                    <div>
                        <h3 className={`font-bold ${displayInfo?.textColor}`}>
                            {displayInfo?.name} Plan
                        </h3>
                        <p className="text-sm text-gray-600">
                            Limited access to premium features
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <CreditsDisplay userId={userId} />
                </div>
            </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Upgrade to Premium</h4>
            <p className="text-sm text-blue-700 mb-3">
                Unlock advanced features like real-time data, Monte Carlo simulations, and priority support.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
                <FeatureBadge featureName="real_time_data" requiredTier="premium" />
                <FeatureBadge featureName="monte_carlo" requiredTier="premium" />
                <FeatureBadge featureName="chat_support" requiredTier="premium" />
            </div>
            <a href="/pricing" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                View Premium Plans
            </a>
        </div>
    </div>
);

// Free Tier Display
const FreeTierDisplay = ({ tierData, displayInfo, userId }) => (
    <div className="space-y-4">
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🆓</span>
                    <div>
                        <h3 className="font-bold text-gray-800">Free Plan</h3>
                        <p className="text-sm text-gray-600">
                            Limited features and analysis credits
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <CreditsDisplay userId={userId} />
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-bold text-purple-900 mb-2">🎯 Unlock Full Potential</h4>
            <p className="text-purple-700 mb-4">
                Upgrade to access AI-powered analysis, portfolio optimization, and advanced market tools.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="text-xs font-medium">AI Analysis</div>
                    <FeatureBadge featureName="ai_analysis" requiredTier="basic" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs font-medium">Portfolio Optimization</div>
                    <FeatureBadge featureName="portfolio_optimization" requiredTier="basic" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">💎</div>
                    <div className="text-xs font-medium">Monte Carlo</div>
                    <FeatureBadge featureName="monte_carlo" requiredTier="premium" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-xs font-medium">Stress Testing</div>
                    <FeatureBadge featureName="stress_testing" requiredTier="premium" />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <a href="/pricing" className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-center font-medium">
                    View All Plans
                </a>
                <button
                    onClick={() => window.location.href = '/pricing#basic'}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Start with Basic - $9/mo
                </button>
            </div>
        </div>
    </div>
);

// No Active Plan Display
const NoActivePlan = () => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
                <h3 className="font-bold text-red-800">No Active Plan</h3>
                <p className="text-red-700 mb-3">
                    You do not have an active membership plan. Choose a plan to get started.
                </p>
                <a href="/pricing" className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium">
                    Choose Your Plan
                </a>
            </div>
        </div>
    </div>
);

// Original component as fallback
const OriginalTierStatus = ({ memberShipData }) => {
    if (memberShipData && (memberShipData.tier === 'premium' || memberShipData.tier === 'enterprise')) {
        return(<><p>    </p></>);
    }
    else if (memberShipData && memberShipData.tier === 'basic') {
        return (
            <div>
                {/* Remove upgrade warning since all features are available in basic plan */}
                <div className="mb-6">
                    <p>Credits remaining: {memberShipData.credits_remaining}</p>
                </div>
                <MarketTools typeTier={memberShipData.tier} />
            </div>
        );
    } else {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">No Active Plan</p>
                <p>You do not have an active membership plan</p>
                <a href="/pricing" className="mt-2 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                    View Pricing Plans
                </a>
            </div>
        );
    }
};

export default TierStatus;