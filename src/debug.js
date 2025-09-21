// Debug API Configuration
console.log('Environment Check:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Mode:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);

// Test API connection
const testApi = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    console.log('API Health Check:', data);
  } catch (error) {
    console.error('API Connection Failed:', error);
  }
};

testApi();

export default testApi;