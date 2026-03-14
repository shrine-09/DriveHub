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
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { changePassword } from "@/services/auth/authServices.tsx";

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

export default function ChangePasswordForm({
                                               className,
                                               ...props
                                           }: React.ComponentProps<"div">) {
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

    const handleChangePassword = async (data: ChangePasswordSchemaType) => {
        try {
            const response = await changePassword(
                data.currentPassword,
                data.newPassword,
                data.confirmNewPassword
            );

            alert(response.message || "Password changed successfully.");
            form.reset();

            localStorage.removeItem("mustChangePassword");

            const role = localStorage.getItem("role");

            if (role === "Admin") {
                navigate("/admin/dashboard");
            } else if (role === "DrivingCenter") {
                navigate("/driving-center/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;

                if (data.errors) {
                    const messages = Object.values(data.errors).flat().join("\n");
                    alert(`Change Password Failed:\n${messages}`);
                } else if (data.message) {
                    alert(`Change Password Failed: ${data.message}`);
                } else if (typeof data === "string") {
                    alert(`Change Password Failed: ${data}`);
                } else {
                    alert("Change password failed.");
                }
            } else {
                alert("Error connecting to backend.");
            }
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className={cn("w-full max-w-sm", className)} {...props}>
                <form onSubmit={form.handleSubmit(handleChangePassword)}>
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

                        <h1 className="text-xl font-bold">Change Password</h1>

                        <FieldDescription>
                            Update your account password securely
                        </FieldDescription>
                    </div>

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
                                        onClick={() =>
                                            setShowCurrentPassword((prev) => !prev)
                                        }
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

                    <Field>
                        <Button type="submit">Update Password</Button>
                    </Field>
                </FieldGroup>
                </form>
            </div>
        </div>
    );
}  
        
        
        
        
