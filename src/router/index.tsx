import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import ProfilePage from '@/pages/ProfilePage';
import ContactsPage from '@/pages/ContactsPage';
import ChatPage from '@/pages/ChatPage';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute: checking auth...');
        checkAuth();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [checkAuth]);

    console.log('ProtectedRoute: render', { isAuthenticated, isLoading });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute: redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Публичный роут (доступен только для неавторизованных пользователей)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        console.log('PublicRoute: checking auth...');
        checkAuth();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [checkAuth]);

    console.log('PublicRoute: render', { isAuthenticated, isLoading });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isAuthenticated) {
        console.log('PublicRoute: redirecting to home');
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