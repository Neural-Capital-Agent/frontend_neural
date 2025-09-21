// Quick Environment Test
import { getApiUrl } from './utils/apiConfig.js';

console.log('=== ENVIRONMENT DEBUG ===');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('MODE:', import.meta.env.MODE);
console.log('getApiUrl():', getApiUrl());
console.log('========================');

// Test specific API call
async function testSpecificEndpoint() {
  try {
    const apiUrl = getApiUrl();
    console.log('Testing login endpoint with URL:', `${apiUrl}/user/login`);
    
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    console.log('Login test response status:', response.status);
    const data = await response.text();
    console.log('Login test response:', data);
  } catch (error) {
    console.error('Login test error:', error);
  }
}

// Run test after page loads
if (typeof window !== 'undefined') {
  window.testLogin = testSpecificEndpoint;
  console.log('Run window.testLogin() in console to test login endpoint');
}

export default testSpecificEndpoint;