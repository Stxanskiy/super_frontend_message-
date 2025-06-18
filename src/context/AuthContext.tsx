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
        console.log('AuthContext: checking auth...');
        const isAuth = authService.isAuthenticated();
        const currentUserId = authService.getUserId();
        console.log('AuthContext: auth check result:', { isAuth, currentUserId });
        setIsAuthenticated(isAuth);
        setUserId(currentUserId);
    };

    const login = () => {
        console.log('AuthContext: login called');
        checkAuth();
    };

    const logout = () => {
        console.log('AuthContext: logout called');
        authService.logout();
        setIsAuthenticated(false);
        setUserId(null);
    };

    // Проверяем авторизацию при инициализации
    useEffect(() => {
        console.log('AuthContext: initial auth check');
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);