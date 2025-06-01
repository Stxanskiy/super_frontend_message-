import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {login} from "@/query/Auth.ts";
import {Link} from "react-router-dom";



interface LoginForm {
    nickname: string;
    password: string;
}

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit  = async (data: LoginForm) => {

        try {
            const  response = await login(data);
            console.log(response);
            // { access_token, refresh_token }

            localStorage.setItem('access_token', response.access_token);
            // refresh_token тоже можно сохранить, если нужно
            // navigate('/chats');
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Неверный логин или пароль');
        }

    };

    return (
        <div className="flex items-center justify-center ">
            <Card className="w-96 p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-center text-2xl font-semibold mb-4">Авторизация</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Введите свой Nickname:</label>
                            <Input type="text" {...register("nickname", { required: "Email is required" })} />
                            {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Ваш пароль:</label>
                            <Input type="password" {...register("password", { required: "Password is required" })} />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">Войти</Button>
                    </form>
                    <div className="text-center text-xs mt-3">
                        <a href="#" className="text-blue-600">Забыли пароль?</a>
                    </div>
                    <div className="text-center text-xs mt-2">
                        <a href="#" className="text-blue-600">Проблемы с авторизацией?</a>
                    </div>
                    <div className="mt-6 border-t pt-4 text-center text-sm">Первый раз у нас?</div>
                    <Link  to="/signUp" className="w-full mt-2">Зарегестрироваться</Link>

                </CardContent>
            </Card>
        </div>
    );
}
