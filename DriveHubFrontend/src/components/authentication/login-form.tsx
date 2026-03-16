import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
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
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginUser } from "@/services/auth/authServices.tsx";

const loginSchema = z.object({
    userEmail: z
        .string()
        .email("Enter a valid email address"),
    userPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userEmail: "",
            userPassword: "",
        },
    });

    const navigate = useNavigate();

    const handleLogin = async (data: LoginSchemaType) => {
        try {
            const response = await loginUser(data.userEmail, data.userPassword);
            const { token, refreshToken, role, name, email, mustChangePassword } = response;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("mustChangePassword", String(mustChangePassword));
            localStorage.setItem("refreshToken", refreshToken);

            if (mustChangePassword) {
                navigate("/change-password");
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

            console.log("Login successful:", response);
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;

                if (data.errors) {
                    const messages = Object.values(data.errors).flat().join("\n");
                    alert(`Login Failed:\n${messages}`);
                } else if (data.message) {
                    alert(`Login Failed: ${data.message}`);
                } else if (typeof data === "string") {
                    alert(`Login Failed: ${data}`);
                } else {
                    alert("Login failed.");
                }
            } else {
                console.error("Login failed:", error.message);
                alert("Error connecting to backend.");
            }
        }
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
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

                        <h1 className="text-xl font-bold">Log in to your account</h1>

                        <FieldDescription>
                            Don&apos;t have an account? <Link to="/register">Sign up</Link>
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
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Field>
                        <Button type="submit">Login</Button>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}