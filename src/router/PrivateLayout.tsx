// src/router/PrivateLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateLayout = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? (
        <div className="app-container">
            {/* Общий layout для приватных страниц */}
            {/*<Header />*/}
            <main>
                <Outlet />
            </main>
            {/*<Footer />*/}
        </div>
    ) : (
        <Navigate to="/login" replace />
    );
};