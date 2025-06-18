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
        console.log('🛡️ ProtectedRoute check:', { isAuthenticated, pathname: location.pathname });
        checkAuth();
        setIsLoading(false);
    }, [checkAuth, location.pathname]);

    if (isLoading) {
        console.log('⏳ ProtectedRoute loading...');
        return null; // или компонент загрузки
    }

    if (!isAuthenticated) {
        console.log('❌ ProtectedRoute redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('✅ ProtectedRoute allowing access');
    return <>{children}</>;
};

// Публичный роут (доступен только для неавторизованных пользователей)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        console.log('🌐 PublicRoute check:', { isAuthenticated, pathname: location.pathname });
        checkAuth();
        setIsLoading(false);
    }, [checkAuth, location.pathname]);

    if (isLoading) {
        console.log('⏳ PublicRoute loading...');
        return null; // или компонент загрузки
    }

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        console.log('✅ PublicRoute redirecting authenticated user to:', from);
        return <Navigate to={from} replace />;
    }

    console.log('✅ PublicRoute allowing access');
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