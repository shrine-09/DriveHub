import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerUser } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const registerSchema = z
    .object({
        userName: z.string().min(2, "Name must be at least 2 characters"),
        userEmail: z.string().email("Enter a valid email address"),
        userPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        userConfirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.userPassword === data.userConfirmPassword, {
        message: "Passwords do not match",
        path: ["userConfirmPassword"],
    });

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            userName: "",
            userEmail: "",
            userPassword: "",
            userConfirmPassword: "",
        },
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const inputClassName =
        "border-white/20 bg-white/10 text-white placeholder:text-slate-200/80";

    const handleRegister = async (data: RegisterSchemaType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await registerUser(
                data.userName,
                data.userEmail,
                data.userPassword
            );

            setStatusMessage(response.message || "Registration successful.");
            setStatusType("success");
            form.reset();

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;

                if (data.errors) {
                    const messages = Object.values(data.errors).flat().join("\n");
                    setStatusMessage(messages);
                } else if (data.message) {
                    setStatusMessage(data.message);
                } else if (typeof data === "string") {
                    setStatusMessage(data);
                } else {
                    setStatusMessage("Registration failed.");
                }
            } else {
                setStatusMessage("Error connecting to backend.");
            }

            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            description="Join DriveHub and get started"
        >
            <form onSubmit={form.handleSubmit(handleRegister)} autoComplete="on">
                <FieldGroup>

                    <Controller
                        control={form.control}
                        name="userName"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-white">Name</FieldLabel>
                                <Input
                                    {...field}
                                    name="name"
                                    autoComplete="name"
                                    placeholder="Full Name"
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
                        name="userEmail"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-white">Email</FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="example@email.com"
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
                                        name="new-password"
                                        autoComplete="new-password"
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

                    <Controller
                        control={form.control}
                        name="userConfirmPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-white">Confirm Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm-password"
                                        autoComplete="new-password"
                                        placeholder="********"
                                        className={`${inputClassName} pr-10`}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-200 hover:bg-transparent hover:text-white"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? (
                                            <Eye size={16} />
                                        ) : (
                                            <EyeOff size={16} />
                                        )}
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
                            className={`rounded-md border px-3 py-2 text-sm whitespace-pre-line ${
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
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>

                        <div className="text-center text-sm text-slate-100/85">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-white underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </Field>
                    
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/15" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-transparent px-3 text-sm text-slate-100/85">
                            Or
                          </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-semibold leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100">
                            Are you a <span className="font-bold">Driving Center</span> looking to expand your reach?
                        </p>
                    </div>

                    <Field>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => navigate("/centersRegister")}
                            className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                            Register as a Service Provider
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="mt-4 text-center pt-3 text-slate-100/85">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </AuthLayout>
    );
}