// Centralized API configuration
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

const getCoralServerUrl = () => {
  return import.meta.env.VITE_CORAL_SERVER_URL || 'http://localhost:5555';
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

// Coral Protocol specific URLs
const getCoralApiUrl = (endpoint = '') => {
  const baseUrl = getApiBaseUrl();
  const coralPath = '/api/v1/coral';
  return `${baseUrl}${coralPath}${endpoint}`;
};

const getCoralDirectUrl = (endpoint = '') => {
  const coralServerUrl = getCoralServerUrl();
  return `${coralServerUrl}${endpoint}`;
};

export {
  getApiBaseUrl,
  getApiUrl,
  getDirectUrl,
  getCoralServerUrl,
  getCoralApiUrl,
  getCoralDirectUrl
};