import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { changePassword } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        confirmNewPassword: z.string().min(1, "Confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "New passwords do not match",
        path: ["confirmNewPassword"],
    });

type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const form = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const navigate = useNavigate();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const handleChangePassword = async (data: ChangePasswordSchemaType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await changePassword(
                data.currentPassword,
                data.newPassword,
                data.confirmNewPassword
            );

            setStatusMessage(response.message || "Password changed successfully.");
            setStatusType("success");
            form.reset();
            localStorage.removeItem("mustChangePassword");

            const role = localStorage.getItem("role");

            setTimeout(() => {
                if (role === "Admin") {
                    navigate("/admin/dashboard");
                } else if (role === "DrivingCenter") {
                    navigate("/driving-center/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
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
                    setStatusMessage("Change password failed.");
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
            title="Change Password"
            description="Update your account password securely"
        >
            <form onSubmit={form.handleSubmit(handleChangePassword)}>
                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="currentPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Current Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    >
                                        {showCurrentPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>New Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                    >
                                        {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Confirm New Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"
                                        onClick={() =>
                                            setShowConfirmNewPassword((prev) => !prev)
                                        }
                                    >
                                        {showConfirmNewPassword ? (
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
                                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                            }`}
                        >
                            {statusMessage}
                        </div>
                    )}

                    <Field>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}