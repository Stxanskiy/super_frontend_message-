import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import ProfilePage from '@/pages/ProfilePage';
import ContactsPage from '@/pages/ContactsPage';
import ChatPage from '@/pages/ChatPage';
import { authService } from '@/lib/auth-service';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setIsLoading(false);
        };

        checkAuth();
    }, [location.pathname]);

    if (isLoading) {
        return null; // или компонент загрузки
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Публичный роут (доступен только для неавторизованных пользователей)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setIsLoading(false);
        };

        checkAuth();
    }, [location.pathname]);

    if (isLoading) {
        return null; // или компонент загрузки
    }

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Index />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <PublicRoute>
                <RegisterPage />
            </PublicRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/contacts',
        element: (
            <ProtectedRoute>
                <ContactsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/chat',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: <NotFound />,
    },
]); 