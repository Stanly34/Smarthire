import axios from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();
const normalizedBaseURL = (() => {
  if (!configuredBaseURL) return '/api';
  const withoutTrailingSlash = configuredBaseURL.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();

const api = axios.create({
  baseURL: normalizedBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor to handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('smarthire_user');
      localStorage.removeItem('smarthire_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
