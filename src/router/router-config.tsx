// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from './PublicLayout';
import { PrivateLayout } from './PrivateLayout';

import {RegisterPage} from "@/pages/RegisterPage.tsx";
import {LoginPage} from "@/pages/LoginPage.tsx";
import {ChatPage} from "@/pages/ChatPage.tsx";




// src/router/index.tsx
export const routerConfig = createBrowserRouter([
    {
        path: '/',
        element: <PrivateLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/chat" replace />,
            },
            {
                path: 'chat',
                element: <ChatPage />, // Добавляем новый приватный маршрут
            },
        ],
    },
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/signUp',
                element: <RegisterPage/>,
            },
            {
                path: '/login',
                element: <LoginPage/>,
            },
            // Удаляем старый маршрут /chatList
        ],
    },
]);