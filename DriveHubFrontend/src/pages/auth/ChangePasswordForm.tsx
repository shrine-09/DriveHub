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

    const inputClassName =
        "!text-white !placeholder:text-slate-200/80 border-white/20 bg-white/10";

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
                                <FieldLabel className="!text-white">Current Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="current-password"
                                        autoComplete="current-password"
                                        placeholder="********"
                                        className={`${inputClassName} pr-10`}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-200 hover:bg-transparent hover:text-white"
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
                                <FieldLabel className="!text-white">New Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showNewPassword ? "text" : "password"}
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
                                <FieldLabel className="!text-white">
                                    Confirm New Password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmNewPassword ? "text" : "password"}
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
                                        onClick={() => setShowConfirmNewPassword((prev) => !prev)}
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
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}