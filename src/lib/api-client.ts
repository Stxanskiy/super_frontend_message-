import axios from 'axios';
import { API_CONFIG } from '@/constants/config';

export const API_URLS = {
  auth: API_CONFIG.AUTH_URL,
  user: API_CONFIG.USER_URL,
  message: API_CONFIG.MESSAGE_URL
};

export const apiClient = axios.create({
  baseURL: API_URLS.auth,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `${API_CONFIG.AUTH_TOKEN_PREFIX}${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  apiClient.defaults.headers.common['Authorization'] = `${API_CONFIG.AUTH_TOKEN_PREFIX}${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  delete apiClient.defaults.headers.common['Authorization'];
}; 