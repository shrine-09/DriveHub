"use client"

import {RegisterForm} from "@/components/authentication/register-form.tsx";
import {Link} from "react-router-dom";

export default function RegisterPage() {
    return (
        <div>
            <div className="flex justify-center gap-2 md:justify-start top-0 left-0 p-6" style={{marginTop: 6.2}}>
                <Link to={"/"} className="flex items-center gap-2 font-medium">
                    <div className="text-xl font-semibold text-white drop-shadow">DriveHub</div>
                </Link>
            </div>
            
            <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"  style={{marginTop: -40}}>
                <div className="w-full max-w-sm">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}