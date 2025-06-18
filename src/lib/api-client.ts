import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '@/constants/config';

export const API_URLS = {
  auth: API_CONFIG.AUTH_URL,
  user: API_CONFIG.USER_URL,
  message: API_CONFIG.MESSAGE_URL
};

// Создаем отдельные клиенты для каждого сервиса
export const authClient = axios.create({
  baseURL: API_URLS.auth,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export const userClient = axios.create({
  baseURL: API_URLS.user,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

export const messageClient = axios.create({
  baseURL: API_URLS.message,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Функция для добавления токена к запросам
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
  console.log('addAuthToken: adding token to request', { 
    url: config.url, 
    hasToken: !!token,
    token: token ? token.substring(0, 20) + '...' : null 
  });
  if (token) {
    config.headers.Authorization = `${API_CONFIG.AUTH_TOKEN_PREFIX}${token}`;
  }
  return config;
};

// Интерцепторы для user и message клиентов
userClient.interceptors.request.use(addAuthToken);
messageClient.interceptors.request.use(addAuthToken);

// Интерцепторы для обработки ошибок
const handleResponseError = (error: AxiosError) => {
  console.log('API Error:', { 
    status: error.response?.status, 
    url: error.config?.url,
    message: error.message 
  });
  if (error.response?.status === 401) {
    console.log('Unauthorized error, clearing auth data');
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.USER_ID_KEY);
  }
  return Promise.reject(error);
};

userClient.interceptors.response.use(
  (response) => {
    console.log('User API Response:', { 
      status: response.status, 
      url: response.config.url,
      data: response.data 
    });
    return response;
  },
  handleResponseError
);

messageClient.interceptors.response.use(
  (response) => {
    console.log('Message API Response:', { 
      status: response.status, 
      url: response.config.url,
      data: response.data 
    });
    return response;
  },
  handleResponseError
);

// Основной клиент для обратной совместимости
export const apiClient = authClient;

export const setAuthToken = (token: string) => {
  console.log('setAuthToken: setting token', { token: token.substring(0, 20) + '...' });
  localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  // Обновляем заголовки для всех клиентов
  userClient.defaults.headers.common['Authorization'] = `${API_CONFIG.AUTH_TOKEN_PREFIX}${token}`;
  messageClient.defaults.headers.common['Authorization'] = `${API_CONFIG.AUTH_TOKEN_PREFIX}${token}`;
};

export const removeAuthToken = () => {
  console.log('removeAuthToken: clearing token');
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.USER_ID_KEY);
  // Удаляем заголовки для всех клиентов
  delete userClient.defaults.headers.common['Authorization'];
  delete messageClient.defaults.headers.common['Authorization'];
}; 