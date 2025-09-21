// Centralized API configuration
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

const getApiUrl = (endpoint = '') => {
  const baseUrl = getApiBaseUrl();
  const apiPath = '/api/v1';
  return `${baseUrl}${apiPath}${endpoint}`;
};

const getDirectUrl = (endpoint = '') => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};

export { getApiBaseUrl, getApiUrl, getDirectUrl };