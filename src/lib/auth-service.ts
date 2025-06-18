import { authClient, setAuthToken } from './api-client';
import { z } from 'zod';
import { AuthResponse } from '@/types/api';

type AccessToken = {
    user_id: string;
    exp: number;
    iat: number;
}

function decodeJwt(token: string | undefined): AccessToken | null {
    if (!token) {
        console.error('Token is undefined or empty');
        return null;
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid token format: token must have 3 parts');
            return null;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload) as AccessToken;
        console.log('🔓 Decoded JWT:', decoded);
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export const loginSchema = z.object({
    nickname: z.string()
        .min(1, "Никнейм должен содержать минимум 1 символ")
        .max(50, "Никнейм должен быть не более 50 символов"),
    password: z.string()
        .min(1, "Пароль должен содержать минимум 1 символ")
});

export const registerSchema = z.object({
    nickname: z.string()
        .min(1, "Никнейм должен содержать минимум 1 символ")
        .max(50, "Никнейм должен быть не более 50 символов"),
    email: z.string()
        .email("Неверный формат email"),
    password: z.string()
        .min(1, "Пароль должен содержать минимум 1 символ")
});

// Генерируем типы из схем
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

class AuthService {
    private token: string | null = null;
    private userId: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authClient.post<AuthResponse>('/auth/login', credentials);
        console.log('🔐 AuthService login response:', response.data);
        
        const { data } = response.data;
        
        if (!data.accessToken) {
            throw new Error('Invalid response: missing accessToken');
        }

        // Извлекаем userId из JWT токена
        const decodedToken = decodeJwt(data.accessToken);
        if (!decodedToken || !decodedToken.user_id) {
            throw new Error('Invalid token: missing user_id');
        }

        console.log('💾 AuthService setting auth data:', { 
            accessToken: data.accessToken.substring(0, 20) + '...', 
            userId: decodedToken.user_id 
        });
        this.setAuthData(data.accessToken, decodedToken.user_id);
        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await authClient.post<AuthResponse>('/auth/register', credentials);
        console.log('📝 AuthService register response:', response.data);
        
        const { data } = response.data;
        
        if (!data.accessToken) {
            throw new Error('Invalid response: missing accessToken');
        }

        // Извлекаем userId из JWT токена
        const decodedToken = decodeJwt(data.accessToken);
        if (!decodedToken || !decodedToken.user_id) {
            throw new Error('Invalid token: missing user_id');
        }

        console.log('💾 AuthService setting auth data:', { 
            accessToken: data.accessToken.substring(0, 20) + '...', 
            userId: decodedToken.user_id 
        });
        this.setAuthData(data.accessToken, decodedToken.user_id);
        return response.data;
    }

    logout() {
        console.log('🚪 AuthService logout called');
        this.clearAuthData();
    }

    isAuthenticated(): boolean {
        const result = !!this.token;
        console.log('🔍 AuthService isAuthenticated:', { result, token: this.token ? 'exists' : 'null' });
        return result;
    }

    getUserId(): string | null {
        console.log('👤 AuthService getUserId:', this.userId);
        return this.userId;
    }

    getToken(): string | null {
        return this.token;
    }

    private setAuthData(token: string, userId: string) {
        console.log('💾 AuthService setAuthData:', { token: token.substring(0, 20) + '...', userId });
        this.token = token;
        this.userId = userId;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setAuthToken(token);
    }

    private clearAuthData() {
        console.log('🧹 AuthService clearAuthData');
        this.token = null;
        this.userId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('refreshToken'); // Удаляем если есть
    }
}

export const authService = new AuthService(); 