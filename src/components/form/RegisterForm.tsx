import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { authService, RegisterCredentials, registerSchema } from "@/lib/auth-service";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterCredentials>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.register(data);
            login();
            navigate('/');
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            setError('Ошибка при регистрации. Возможно, такой пользователь уже существует.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-96 p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-center text-2xl font-semibold mb-4">Регистрация</h2>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Никнейм:</label>
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
                            <label className="block text-sm font-medium">Email:</label>
                            <Input 
                                autoComplete="email"
                                type="email" 
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Пароль:</label>
                            <Input
                                autoComplete="new-password"
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
                            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                    </form>
                    <div className="mt-6 border-t pt-4 text-center text-sm">
                        Уже есть аккаунт?
                    </div>
                    <Link 
                        to="/login" 
                        className="block w-full text-center mt-2 text-blue-600 hover:text-blue-800"
                    >
                        Войти
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
} 