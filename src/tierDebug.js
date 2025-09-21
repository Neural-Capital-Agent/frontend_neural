// Debug Tier System
import { getApiUrl } from './utils/apiConfig.js';

console.log('=== TIER SYSTEM DEBUG ===');

// Test tier service functionality
const testTierService = async () => {
  try {
    const userId = localStorage.getItem('userId') || 'test_user';
    console.log('Testing with userId:', userId);
    
    // Import tier service
    const tierService = (await import('./services/tierService.js')).default;
    
    // Test feature access
    console.log('hasFeatureAccess(ai_analysis):', tierService.hasFeatureAccess('ai_analysis'));
    console.log('hasUsageRemaining():', tierService.hasUsageRemaining());
    console.log('currentUserTier:', tierService.currentUserTier);
    
    // Test initialization
    try {
      const tierData = await tierService.initializeTierMonitoring(userId);
      console.log('Tier initialization result:', tierData);
    } catch (error) {
      console.log('Tier initialization error:', error.message);
    }
    
  } catch (error) {
    console.error('Tier debug error:', error);
  }
};

// Run test
testTierService();

export default testTierService;