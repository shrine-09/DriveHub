import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";
import { useNavigate, useSearchParams } from "react-router-dom";

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const inputClassName =
        "!text-white !placeholder:text-slate-200/80 border-white/20 bg-white/10";

    const handleResetPassword = async (data: ResetPasswordSchemaType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await resetPassword(
                email,
                token,
                data.newPassword,
                data.confirmPassword
            );

            setStatusMessage(response.message || "Password reset successfully.");
            setStatusType("success");
            form.reset();

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors)
                    .flat()
                    .join("\n");
                setStatusMessage(messages);
            } else {
                setStatusMessage("Reset password failed.");
            }
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            description="Enter your new password below"
        >
            <form onSubmit={form.handleSubmit(handleResetPassword)}>
                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">New Password</FieldLabel>
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
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">Confirm Password</FieldLabel>
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
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                            className="w-full !text-white bg-[#3B82F6] hover:bg-[#2563EB]"
                        >
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}