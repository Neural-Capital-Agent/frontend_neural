// Tier Service for Real-time User Tier Management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class TierService {
  constructor() {
    this.listeners = new Set();
    this.currentUserTier = null;
    this.userId = null;
    this.pollingInterval = null;
  }

  // Initialize tier monitoring for a user
  async initializeTierMonitoring(userId) {
    try {
      this.userId = userId;

      // Try to get tier data from backend, fall back to default if it fails
      try {
        await this.fetchUserTierFromBackend();
        // Set up periodic polling for updates
        this.setupPolling();
        console.log('Tier monitoring initialized for user:', userId);
      } catch (backendError) {
        console.warn('Backend tier API unavailable, using fallback mode:', backendError.message);
        this.currentUserTier = this.getFallbackTierData();
      }

      return this.currentUserTier;
    } catch (error) {
      console.error('Error initializing tier monitoring:', error);
      // Fall back to default tier if there's an error
      this.currentUserTier = this.getFallbackTierData();
      return this.currentUserTier;
    }
  }

  // Get fallback tier data when Supabase is not available
  getFallbackTierData() {
    return {
      tier: 'free',
      credits_remaining: 10,
      tier_expires_at: null,
      tier_features: this.getDefaultFeatures('free'),
      last_updated: new Date().toISOString(),
      fallback_mode: true
    };
  }

  // Fetch user tier from backend API
  async fetchUserTierFromBackend() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tier/current?user_id=${this.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.detail?.message || 'Backend returned unsuccessful response');
      }

      this.currentUserTier = {
        tier: result.tier_data.tier || 'free',
        credits_remaining: result.tier_data.credits_remaining || 0,
        tier_expires_at: result.tier_data.tier_expires_at,
        tier_features: result.tier_data.tier_features || this.getDefaultFeatures('free'),
        last_updated: result.tier_data.last_updated || new Date().toISOString()
      };

      // Notify all listeners of tier change
      this.notifyListeners(this.currentUserTier);

      return this.currentUserTier;
    } catch (error) {
      console.error('Error fetching user tier from backend:', error);
      throw error;
    }
  }

  // Set up polling to check for tier changes
  setupPolling() {
    // Clear existing polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Poll every 30 seconds for tier changes
    this.pollingInterval = setInterval(async () => {
      try {
        const previousTier = this.currentUserTier?.tier;
        await this.fetchUserTierFromBackend();

        // Check if tier changed
        if (this.currentUserTier?.tier !== previousTier) {
          console.log('Tier change detected via polling:', {
            from: previousTier,
            to: this.currentUserTier?.tier
          });

          // Dispatch tier change event
          this.dispatchTierChangeEvent();
        }
      } catch (error) {
        console.error('Error during tier polling:', error);
      }
    }, 30000); // Poll every 30 seconds

    console.log('Tier polling established (30s interval)');
  }

  // Dispatch tier change event to the DOM
  dispatchTierChangeEvent() {
    const event = new CustomEvent('tierChanged', {
      detail: {
        tier: this.currentUserTier?.tier,
        credits_remaining: this.currentUserTier?.credits_remaining,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  }

  // Add listener for tier changes
  addTierListener(callback) {
    this.listeners.add(callback);

    // Immediately call with current tier if available
    if (this.currentUserTier) {
      callback(this.currentUserTier);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of tier changes
  notifyListeners(tierData) {
    this.listeners.forEach(callback => {
      try {
        callback(tierData);
      } catch (error) {
        console.error('Error in tier listener callback:', error);
      }
    });
  }

  // Show tier change notification
  showTierChangeNotification(previousTier, newTier) {
    const isUpgrade = this.getTierLevel(newTier) > this.getTierLevel(previousTier);

    const notification = {
      type: isUpgrade ? 'success' : 'info',
      title: isUpgrade ? 'Plan Upgraded!' : 'Plan Changed',
      message: `Your plan has been ${isUpgrade ? 'upgraded' : 'changed'} from ${previousTier} to ${newTier}`,
      duration: 5000
    };

    // Dispatch custom event for notification system
    window.dispatchEvent(new CustomEvent('tierChanged', {
      detail: { notification, previousTier, newTier }
    }));
  }

  // Get tier level for comparison
  getTierLevel(tier) {
    const levels = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'enterprise': 3
    };
    return levels[tier] || 0;
  }

  // Get default features for a tier
  getDefaultFeatures(tier) {
    const tierFeatures = {
      'free': {
        'ai_analysis': true,
        'portfolio_optimization': true,
        'real_time_data': true,
        'advanced_charts': true,
        'chat_support': true,
        'api_access': true,
        'monte_carlo': true,
        'stress_testing': true,
        'custom_reports': true,
        'priority_support': true,
        'daily_analysis_limit': 5,
        'monthly_analysis_limit': 50
      },
      'basic': {
        'ai_analysis': true,
        'portfolio_optimization': true,
        'real_time_data': true,
        'advanced_charts': true,
        'chat_support': true,
        'api_access': true,
        'monte_carlo': true,
        'stress_testing': true,
        'custom_reports': true,
        'priority_support': true,
        'daily_analysis_limit': 20,
        'monthly_analysis_limit': 200
      },
      'premium': {
        'ai_analysis': true,
        'portfolio_optimization': true,
        'real_time_data': true,
        'advanced_charts': true,
        'chat_support': true,
        'api_access': false,
        'monte_carlo': true,
        'stress_testing': true,
        'custom_reports': true,
        'priority_support': false,
        'daily_analysis_limit': 100,
        'monthly_analysis_limit': 1000
      },
      'enterprise': {
        'ai_analysis': true,
        'portfolio_optimization': true,
        'real_time_data': true,
        'advanced_charts': true,
        'chat_support': true,
        'api_access': true,
        'monte_carlo': true,
        'stress_testing': true,
        'custom_reports': true,
        'priority_support': true,
        'daily_analysis_limit': -1, // Unlimited
        'monthly_analysis_limit': -1 // Unlimited
      }
    };

    return tierFeatures[tier] || tierFeatures['free'];
  }

  // Check if user has access to a specific feature
  hasFeatureAccess(featureName) {
    if (!this.currentUserTier) {
      // Default to free tier features when tier data is not loaded
      const freeTierFeatures = this.getDefaultFeatures('free');
      return freeTierFeatures[featureName] === true;
    }

    const features = this.currentUserTier.tier_features || this.getDefaultFeatures(this.currentUserTier.tier);
    return features[featureName] === true;
  }

  // Check if user has remaining credits/usage
  hasUsageRemaining(featureName = null) {
    if (!this.currentUserTier) {
      // Default to allowing usage when tier data is not loaded (free tier)
      return true;
    }

    // Check daily limits
    const features = this.currentUserTier.tier_features || this.getDefaultFeatures(this.currentUserTier.tier);
    const dailyLimit = features.daily_analysis_limit;

    if (dailyLimit === -1) {
      return true; // Unlimited
    }

    // In a real implementation, you'd track daily usage
    // For now, return true if credits remaining > 0
    return this.currentUserTier.credits_remaining > 0;
  }

  // Get current tier data
  getCurrentTier() {
    return this.currentUserTier;
  }

  // Get tier display information
  getTierDisplayInfo() {
    if (!this.currentUserTier) {
      return null;
    }

    const tierInfo = {
      'free': {
        name: 'Free',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-300',
        icon: '🆓'
      },
      'basic': {
        name: 'Basic',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300',
        icon: '⭐'
      },
      'premium': {
        name: 'Premium',
        color: 'purple',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-300',
        icon: '💎'
      },
      'enterprise': {
        name: 'Enterprise',
        color: 'gold',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300',
        icon: '👑'
      }
    };

    return {
      ...tierInfo[this.currentUserTier.tier] || tierInfo['free'],
      tier: this.currentUserTier.tier,
      credits_remaining: this.currentUserTier.credits_remaining,
      expires_at: this.currentUserTier.tier_expires_at
    };
  }

  // Force refresh tier data
  async refreshTierData() {
    if (!this.userId) {
      throw new Error('User ID not set. Call initializeTierMonitoring first.');
    }

    return await this.fetchUserTierFromBackend();
  }

  // Clean up polling and listeners
  cleanup() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    this.listeners.clear();
    this.currentUserTier = null;
    this.userId = null;

    console.log('Tier service cleaned up');
  }

  // Validate feature access via backend API
  async validateFeatureAccess(featureName) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tier/validate-feature?user_id=${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feature_name: featureName })
      });

      if (!response.ok) {
        throw new Error(`Failed to validate feature: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.access_granted : false;
    } catch (error) {
      console.error('Error validating feature access:', error);
      // Fallback to local validation
      return this.hasFeatureAccess(featureName);
    }
  }

  // Simulate tier change (for testing) - uses backend API
  async simulateTierChange(newTier) {
    if (!this.userId) {
      console.error('Cannot simulate tier change: User ID not set');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tier/update-tier?user_id=${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          new_tier: newTier,
          credits: this.getDefaultCredits(newTier)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update tier: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`Tier changed to ${newTier} for user ${this.userId}`);
        // Refresh tier data to get the updated information
        await this.fetchUserTierFromBackend();
      } else {
        throw new Error(result.detail?.message || 'Failed to update tier');
      }
    } catch (error) {
      console.error('Error simulating tier change:', error);
      throw error;
    }
  }

  // Get default credits for tier
  getDefaultCredits(tier) {
    const credits = {
      'free': 10,
      'basic': 100,
      'premium': 500,
      'enterprise': 10000
    };
    return credits[tier] || 10;
  }
}

// Export singleton instance
export default new TierService();