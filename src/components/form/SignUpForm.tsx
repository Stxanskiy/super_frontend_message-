import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {signUp} from "@/query/Auth.ts";
import {Link} from "react-router-dom";



// Создаем схему валидации с помощью Zod
const signUpSchema = z.object({
    nickname: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: z.string()
        .email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
});

// Генерируем тип из схемы
type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit = async  (data: SignUpForm) => {
        try {
            const response= await signUp(data);
            alert(`Пользователь ${response.nickname} зарегистрирован`);

        }catch (error) {
            console.error('Ошибка при регистрации: ', error);
            alert('Ошибка при регистрации. Возможно, ник уже занят.');
        }
        console.log(data);
    };

    return (
        <div className="flex items-center justify-center ">
            <Card className="w-96 p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-center text-2xl font-semibold mb-4">Регистрация</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Nickname:</label>
                            <Input
                                type="text"
                                {...register("nickname")}
                                className={errors.nickname ? "border-red-500" : ""}
                            />
                            {errors.nickname && (
                                <p className="text-red-500 text-xs mt-1">{errors.nickname.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Почта:</label>
                            <Input
                                type="email"
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium">Пароль:</label>
                            <Input
                                type="password"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Зарегестрироватсья
                        </Button>
                    </form>

                    <div className="mt-6 border-t pt-4 text-center text-sm">
                        Уже есть аккаунт?
                    </div>
                    <Link to="/login" className="w-full mt-2">
                        Авторизоваться
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}