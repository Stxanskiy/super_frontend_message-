import { RegisterForm } from "@/components/form/RegisterForm";

export function RegisterPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
            <div className="w-full max-w-md p-4">
                <RegisterForm />
            </div>
        </div>
    );
} 