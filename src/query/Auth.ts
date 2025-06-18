import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterCredentials } from '@/lib/auth-service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Хук для входа в систему
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      login(); // Обновляем состояние в AuthContext
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Перенаправляем на главную страницу
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Хук для регистрации
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      login(); // Обновляем состояние в AuthContext
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Перенаправляем на главную страницу
      navigate('/');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// Хук для выхода из системы
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => {
      logout(); // Используем logout из AuthContext
      return Promise.resolve();
    },
    onSuccess: () => {
      // Очищаем весь кеш
      queryClient.clear();
      // Перенаправляем на страницу входа
      navigate('/login');
    },
  });
};
