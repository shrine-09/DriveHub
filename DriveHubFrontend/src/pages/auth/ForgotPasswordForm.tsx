import { GalleryVerticalEnd } from "lucide-react";
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
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/services/auth/authServices.tsx";

const forgotPasswordSchema = z.object({
    userEmail: z.string().email("Enter a valid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm({
                                               className,
                                               ...props
                                           }: React.ComponentProps<"div">) {
    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            userEmail: "",
        },
    });

    const handleForgotPassword = async (data: ForgotPasswordSchemaType) => {
        try {
            const response = await forgotPassword(data.userEmail);
            alert(response.message || "Password reset link sent.");
            form.reset();
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
                <form onSubmit={form.handleSubmit(handleForgotPassword)}>
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

                            <h1 className="text-xl font-bold">Forgot Password</h1>
                            <FieldDescription>
                                Enter your email to receive a password reset link
                            </FieldDescription>
                        </div>

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

                        <Field>
                            <Button type="submit">Send Reset Link</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}