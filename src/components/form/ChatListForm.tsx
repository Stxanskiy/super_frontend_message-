import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Схема валидации
const messageSchema = z.object({
    recipient: z.string().min(1, "Выберите получателя"),
    message: z.string()
        .min(1, "Сообщение не может быть пустым")
        .max(500, "Сообщение слишком длинное"),
    attachment: z.instanceof(File).optional(),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function ChatForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<MessageForm>({
        resolver: zodResolver(messageSchema),
    });

    // ... остальной код

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Новое сообщение</h2>
                    <form onSubmit={handleSubmit()} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Получатель</label>
                            <Controller
                                name="recipient"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите получателя" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="diane">Diane Smith</SelectItem>
                                            <SelectItem value="michelle">Michelle Bale</SelectItem>
                                            <SelectItem value="lynn">Lynn Shivers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.recipient && (
                                <p className="text-red-500 text-xs mt-1">{errors.recipient.message}</p>
                            )}
                        </div>

                        {/* ... остальные поля формы */}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}