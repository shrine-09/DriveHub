import {Eye, EyeOff, GalleryVerticalEnd} from "lucide-react"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Link, useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import GradientText from "@/components/GradientText.tsx";
import {useState} from "react";
import {registerUser} from "@/services/auth/authServices.tsx";

const registerSchema = z
    .object({
        userName: z.string("Enter your full name").min(2, "Name must be at least 2 characters"),
        userEmail: z.email("Email a valid email address"),
        userPassword: z
            .string("Enter a strong password")
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        userConfirmPassword: z.string("Confirm your password")
    })
    .refine((data) => data.userPassword === data.userConfirmPassword, {
    message: "Passwords do not match",
    path: ["userConfirmPassword"],
    })

type RegisterSchemaType = z.infer<typeof registerSchema>;

export function RegisterForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema)
    })

    const handleRegister = async (data: RegisterSchemaType) => {
        try {
            const response = await registerUser(
                data.userName, 
                data.userEmail, 
                data.userPassword
            );
            console.log("Registration Successful:", response.data);
            alert("Registration Successful!");
        } catch (error: any) {
            if (error.response) {
                console.error("Server responded with error:", error.response.data);
                alert(`Registration failed: ${error.response.data}`);
            } else {
                console.error("Error connecting to backend:", error.message);
                alert("Login Failed");
            }
        }
    }

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={form.handleSubmit(handleRegister)}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Link
                            to={"/"}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6"/>
                            </div>
                            <span className="sr-only">DriveHub</span>
                        </Link>

                        <h1 className="text-xl font-bold">Create your account</h1>

                        <FieldDescription>
                            Already have an account? <Link to={"/login"}>Sign in</Link>
                        </FieldDescription>
                    </div>

                    {/* Name */}
                    <Controller
                        control={form.control}
                        name={"userName"}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Name</FieldLabel>
                                <Input {...field} placeholder={"Full Name"}/>
                                {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                        )}
                    />

                    {/* Email */}
                    <Controller
                        control={form.control}
                        name={"userEmail"}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Email</FieldLabel>
                                <Input {...field} placeholder={"Example@email.com"}/>
                                {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                        )}
                    />

                    {/* Password */}
                    <Controller
                        control={form.control}
                        name={"userPassword"}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Password</FieldLabel>
                                <div className={"relative"}>
                                    <Input {...field} type={showPassword ? "text" : "password"}
                                           placeholder={"********"}/>
                                    <Button
                                        type={"button"}
                                        size={"icon"}
                                        variant={"ghost"}
                                        className={"absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <Eye size={8}/> : <EyeOff size={8}/>}
                                    </Button>
                                </div>
                                {fieldState.error?.message && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Confirm Password */}
                    <Controller
                        control={form.control}
                        name={"userConfirmPassword"}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Confirm Password</FieldLabel>
                                <div className={"relative"}>
                                    <Input {...field} type={showConfirmPassword ? "text" : "password"}
                                           placeholder={"********"}/>
                                    <Button
                                        type={"button"}
                                        size={"icon"}
                                        variant={"ghost"}
                                        className={"absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2"}
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? <Eye size={8}/> : <EyeOff size={8}/>}
                                    </Button>
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                        )}
                    />

                    <Field>
                        <Button type="submit">Register</Button>
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
                            style={{marginTop: -15}}
                            variant={"outline"} type={"button"}
                            onClick={() => navigate("/centersRegister")}
                        >
                            Register as a Service Provider
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
