import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService, LoginCredentials, loginSchema } from "@/lib/auth-service";
import { useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('LoginForm: attempting login...');
            await authService.login(data);
            console.log('LoginForm: login successful, calling login()');
            login();
            console.log('LoginForm: navigating to:', from);
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 100);
        } catch (error: unknown) {
            console.error('LoginForm: login error:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    setError('Неверный логин или пароль');
                } else if (error.response?.status === 400) {
                    setError('Проверьте правильность введенных данных');
                } else {
                    setError('Произошла ошибка при входе. Попробуйте позже');
                }
            } else {
                setError('Произошла ошибка при входе. Попробуйте позже');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-96 p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-center text-2xl font-semibold mb-4">Авторизация</h2>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Введите свой никнейм:</label>
                            <Input
                                autoComplete="username" 
                                type="text" 
                                {...register("nickname")}
                                className={errors.nickname ? "border-red-500" : ""}
                            />
                            {errors.nickname && (
                                <p className="text-red-500 text-xs mt-1">{errors.nickname.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Ваш пароль:</label>
                            <Input 
                                autoComplete="current-password"
                                type="password" 
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </Button>
                    </form>
                    <div className="mt-6 border-t pt-4 text-center text-sm">
                        Первый раз у нас?
                    </div>
                    <Link 
                        to="/register" 
                        className="block w-full text-center mt-2 text-blue-600 hover:text-blue-800"
                    >
                        Зарегистрироваться
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
