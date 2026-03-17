import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GradientText from "@/components/GradientText.tsx";
import { useState } from "react";
import { registerUser } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const registerSchema = z
    .object({
        userName: z
            .string()
            .min(2, "Name must be at least 2 characters"),
        userEmail: z
            .string()
            .email("Enter a valid email address"),
        userPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        userConfirmPassword: z
            .string()
            .min(1, "Confirm your password"),
    })
    .refine((data) => data.userPassword === data.userConfirmPassword, {
        message: "Passwords do not match",
        path: ["userConfirmPassword"],
    });

type RegisterSchemaType = z.infer<typeof registerSchema>;

export function RegisterForm() {
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
            <form onSubmit={form.handleSubmit(handleRegister)}>
                <FieldGroup>
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="cursor-pointer hover:underline">
                            Sign in
                        </Link>
                    </div>

                    <Controller
                        control={form.control}
                        name="userName"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Name</FieldLabel>
                                <Input {...field} placeholder="Full Name" />
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
                                <FieldLabel>Email</FieldLabel>
                                <Input {...field} type="email" placeholder="example@email.com" />
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
                                <FieldLabel>Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"
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
                                <FieldLabel>Confirm Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"
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
                                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                            }`}
                        >
                            {statusMessage}
                        </div>
                    )}

                    <Field>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </Field>

                    <FieldSeparator>Or</FieldSeparator>

                    <h1 className="text-center text-lg font-semi-bold">
                        <GradientText
                            colors={["#59C173", "#99f2c8", "#59C173", "#99f2c8", "#59C173"]}
                            animationSpeed={3.4}
                            showBorder={false}
                            className="custom-class"
                        >
                            Are you a <b>Driving Center</b> looking to expand your reach?
                        </GradientText>
                    </h1>

                    <Field>
                        <Button
                            style={{ marginTop: -15 }}
                            variant="outline"
                            type="button"
                            onClick={() => navigate("/centersRegister")}
                        >
                            Register as a Service Provider
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </AuthLayout>
    );
}