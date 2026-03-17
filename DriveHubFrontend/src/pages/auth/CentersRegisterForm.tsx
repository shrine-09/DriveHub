import { z } from "zod";
import { useState } from "react";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerCenter } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const centerSchema = z.object({
    centerEmail: z.string().email("Enter a valid email address"),
    centerContact: z
        .string()
        .regex(/^\d+$/, "Enter a valid contact number"),
    companyName: z
        .string()
        .min(2, "Enter a valid company name"),
    regNo: z
        .string()
        .regex(/^\d+$/, "Enter a valid registration number"),
    companyType: z
        .string()
        .min(1, "Select a company type")
        .refine(
            (value) => ["public", "private", "nonprofit"].includes(value),
            "Select a valid company type"
        ),
});

type CenterFormType = z.infer<typeof centerSchema>;

export default function CentersRegisterPage() {
    const form = useForm<CenterFormType>({
        resolver: zodResolver(centerSchema),
        defaultValues: {
            centerEmail: "",
            centerContact: "",
            companyName: "",
            regNo: "",
            companyType: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const handleCenterRegister = async (data: CenterFormType) => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await registerCenter(
                data.centerEmail,
                data.centerContact,
                data.companyName,
                data.regNo,
                data.companyType
            );

            setStatusMessage(
                response.message ||
                "Registration submitted successfully. Please wait for admin approval."
            );
            setStatusType("success");
            form.reset();
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
            title="Register Driving Center"
            description="Submit your company details for verification and approval"
        >
            <form onSubmit={form.handleSubmit(handleCenterRegister)}>
                <FieldGroup>
                    <Controller
                        name="centerEmail"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Email</FieldLabel>
                                <Input {...field} type="email" placeholder="example@email.com" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="centerContact"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Contact No.</FieldLabel>
                                <Input {...field} placeholder="9800000000" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <FieldSeparator />

                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-sm text-balance text-shadow-primary">
                            Fill in the form below in accordance to the{" "}
                            <a
                                href="https://www.lawimperial.com/company-registration-in-nepal/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-primary/80 cursor-pointer"
                            >
                                Certificate of Incorporation of Company
                            </a>
                        </p>
                    </div>

                    <Controller
                        name="companyName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Registered Company Name</FieldLabel>
                                <Input {...field} placeholder="ABC Driving Center" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="regNo"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Registration No.</FieldLabel>
                                <Input {...field} placeholder="123456789" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="companyType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Company Type</FieldLabel>
                                <select
                                    {...field}
                                    className="border bg-background p-2 rounded-md"
                                >
                                    <option value="">Select Type</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="nonprofit">Non-Profit</option>
                                </select>
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
                            {isSubmitting ? "Submitting..." : "Register"}
                        </Button>
                    </Field>

                    <FieldDescription className="text-center">
                        A register request is created once the form is submitted, the form
                        will be verified by DriveHub. If the form is successfully verified,
                        an email will be sent to the provided email with the log-in
                        credentials for your new dashboard technology.
                    </FieldDescription>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}