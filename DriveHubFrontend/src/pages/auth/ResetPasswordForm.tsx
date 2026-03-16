import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { resetPassword } from "@/services/auth/authServices.tsx";

const resetPasswordSchema = z
    .object({
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
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm({
                                              className,
                                              ...props
                                          }: React.ComponentProps<"div">) {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const navigate = useNavigate();

    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handleResetPassword = async (data: ResetPasswordSchemaType) => {
        if (!token) {
            alert("Invalid or missing reset token.");
            return;
        }

        try {
            const response = await resetPassword(
                token,
                data.newPassword,
                data.confirmNewPassword
            );

            alert(response.message || "Password reset successfully.");
            navigate("/login");
        } catch (error: any) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Error connecting to backend.");
            }
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className={cn("w-full max-w-sm", className)} {...props}>
                <form onSubmit={form.handleSubmit(handleResetPassword)}>
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Link
                                to="/"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex size-8 items-center justify-center rounded-md">
                                    <GalleryVerticalEnd className="size-6" />
                                </div>
                                <span className="sr-only">DriveHub</span>
                            </Link>

                            <h1 className="text-xl font-bold">Reset Password</h1>
                            <FieldDescription>
                                Enter your new password
                            </FieldDescription>
                        </div>

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

                        <Field>
                            <Button type="submit">Reset Password</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}