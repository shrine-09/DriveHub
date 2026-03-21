import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginUser } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const loginSchema = z.object({
    userEmail: z.string().email("Enter a valid email address"),
    userPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userEmail: "",
            userPassword: "",
        },
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const inputClassName =
        "border-white/20 bg-white/10 text-white placeholder:text-slate-200/80";

    const handleLogin = async (data: LoginSchemaType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await loginUser(data.userEmail, data.userPassword);
            const {
                token,
                refreshToken,
                role,
                name,
                email,
                mustChangePassword,
                isProfileComplete,
            } = response;

            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("mustChangePassword", String(mustChangePassword));
            localStorage.setItem("isProfileComplete", String(isProfileComplete));

            if (mustChangePassword) {
                navigate("/change-password");
                return;
            }

            if (role === "DrivingCenter" && !isProfileComplete) {
                navigate("/driving-center/setup-profile");
                return;
            }

            const normalizedRole = role.toLowerCase();

            if (normalizedRole === "admin") {
                navigate("/admin/dashboard");
            } else if (normalizedRole === "drivingcenter") {
                navigate("/driving-center/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else {
                setStatusMessage("Login failed. Please try again.");
            }
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Log in to your account"
            description="Access your DriveHub account securely"
        >
            <form onSubmit={form.handleSubmit(handleLogin)} autoComplete="on">
                <FieldGroup>
                    <div className="text-center text-sm text-slate-100/85">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-white underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </div>

                    <Controller
                        control={form.control}
                        name="userEmail"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-white">Email</FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className={inputClassName}
                                />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="userPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-white">Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="********"
                                        className={`${inputClassName} pr-10`}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-200 hover:bg-transparent hover:text-white"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                </div>
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {statusMessage && (
                        <div
                            className={`rounded-md border px-3 py-2 text-sm ${
                                statusType === "success"
                                    ? "border-green-500/30 bg-green-500/10 text-green-100"
                                    : "border-red-500/30 bg-red-500/10 text-red-100"
                            }`}
                        >
                            {statusMessage}
                        </div>
                    )}

                    <Field>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </Field>

                    <FieldDescription className="text-center text-slate-100/85">
                        <Link
                            to="/forgot-password"
                            className="font-medium text-white underline underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}