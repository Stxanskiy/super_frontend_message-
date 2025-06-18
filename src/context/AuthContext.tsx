// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    login: () => void;
    logout: () => void;
    checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const checkAuth = () => {
        const isAuth = authService.isAuthenticated();
        const currentUserId = authService.getUserId();
        setIsAuthenticated(isAuth);
        setUserId(currentUserId);
    };

    const login = () => {
        checkAuth();
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUserId(null);
    };

    // Проверяем авторизацию при инициализации
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);