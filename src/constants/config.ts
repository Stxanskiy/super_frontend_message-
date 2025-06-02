export const API_CONFIG = {
  // API URLs
  AUTH_URL: 'http://localhost:8080',
  USER_URL: 'http://localhost:8081',
  MESSAGE_URL: 'http://localhost:8083',
  API_URL: 'http://localhost:8083',
  WS_URL: 'ws://localhost:8083/ws',

  // Local Storage Keys
  TOKEN_KEY: 'token',
  USER_ID_KEY: 'userId',

  // API Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  // Auth Token Format
  AUTH_TOKEN_PREFIX: 'Bearer ',

  AUTH_TOKEN_HEADER: 'Authorization',
} as const; 