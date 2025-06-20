import {LoginForm} from "@/components/form/LoginForm.tsx";

export function LoginPage(){
    return(
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
            <div className="w-full max-w-md p-4">
                <LoginForm/>
            </div>
        </div>
    )
}

