import { z } from "zod";
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
import { forgotPassword } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";
import { useState } from "react";

const forgotPasswordSchema = z.object({
    userEmail: z.string().email("Enter a valid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            userEmail: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const handleForgotPassword = async (data: ForgotPasswordSchemaType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await forgotPassword(data.userEmail);
            setStatusMessage(
                response.message || "If an account with that email exists, a reset link has been sent."
            );
            setStatusType("success");
            form.reset();
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
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
            title="Forgot Password"
            description="Enter your email to receive a password reset link"
        >
            <form onSubmit={form.handleSubmit(handleForgotPassword)}>
                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="userEmail"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Email</FieldLabel>
                                <Input {...field} type="email" placeholder="email@example.com" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {statusMessage && (
                        <div
                            className={`rounded-md border px-3 py-2 text-sm ${
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
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}