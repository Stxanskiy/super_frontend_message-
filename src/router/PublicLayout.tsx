// src/router/PublicLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicLayout = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <div className="public-container">
            {/* Общий layout для публичных страниц */}

            <Outlet />
        </div>
    ) : (
        <Navigate to="/dashboard" replace />
    );
};