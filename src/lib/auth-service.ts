import { apiClient, setAuthToken } from './api-client';
import { z } from 'zod';

type AccessToken = {
    user_id: string
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
        return JSON.parse(jsonPayload) as AccessToken;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export const loginSchema = z.object({
    nickname: z.string()
        .min(1, "Никнейм должен содержать минимум 2 символа")
        .max(50, "Никнейм должен быть не более 50 символов"),
    password: z.string()
        .min(1, "Пароль должен содержать минимум 6 символов")
});

export const registerSchema = z.object({
    nickname: z.string()
        .min(2, "Никнейм должен содержать минимум 2 символа")
        .max(50, "Никнейм должен быть не более 50 символов"),
    email: z.string()
        .email("Неверный формат email"),
    password: z.string()
        .min(1, "Пароль должен содержать минимум 6 символов")
});

// Генерируем типы из схем
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

export interface AuthResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    },
    success: boolean;
}

class AuthService {
    private token: string | null = null;
    private refreshToken: string | null = null;
    private userId: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.userId = localStorage.getItem('userId');
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        console.log(response)
        const { data, success } = response.data;
        const { accessToken, refreshToken } = data;
        
        if (!success || !accessToken) {
            throw new Error('No access token received');
        }

        const decodedToken = decodeJwt(accessToken);
        console.log(decodedToken)
        if (!decodedToken?.user_id) {
            throw new Error('Invalid token format or missing user ID');
        }

        this.setAuthData(accessToken, refreshToken, decodedToken.user_id);
        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
        console.log(response)
        const { data, success } = response.data;
        const { accessToken, refreshToken } = data;
        
        if (!success || !accessToken) {
            throw new Error('No access token received');
        }
        const decodedToken = decodeJwt(accessToken);
        console.log("decodedToken", decodedToken)
        if (!decodedToken?.user_id) {
            throw new Error('Invalid token format or missing user ID');
        }

        this.setAuthData(accessToken, refreshToken, decodedToken.user_id);
        return response.data;
    }

    logout() {
        this.clearAuthData();
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    getUserId(): string | null {
        return this.userId;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    private setAuthData(token: string, refreshToken: string, userId: string) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        setAuthToken(token);
    }

    private clearAuthData() {
        this.token = null;
        this.refreshToken = null;
        this.userId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        apiClient.defaults.headers.common['Authorization'] = '';
    }
}

export const authService = new AuthService(); 