import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerCenter } from "@/services/auth/authServices.tsx";
import AuthLayout from "@/components/authentication/AuthLayout";

const centerSchema = z.object({
    centerEmail: z.string().email("Enter a valid email address"),
    centerContact: z.string().regex(/^\d+$/, "Enter a valid contact number"),
    companyName: z.string().min(2, "Enter a valid company name"),
    regNo: z.string().regex(/^\d+$/, "Enter a valid registration number"),
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

    const inputClassName =
        "!text-white !placeholder:text-slate-200/80 border-white/20 bg-white/10";

    const selectClassName =
        "h-11 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm !text-white outline-none focus:ring-2 focus:ring-[#3B82F6]";

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
            <form onSubmit={form.handleSubmit(handleCenterRegister)} autoComplete="on">
                <FieldGroup>

                    <Controller
                        name="centerEmail"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">Email</FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="example@email.com"
                                    className={inputClassName}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="centerContact"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">Contact No.</FieldLabel>
                                <Input
                                    {...field}
                                    name="tel"
                                    autoComplete="tel"
                                    placeholder="9800000000"
                                    className={inputClassName}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/15" />
                        </div>
                        <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-sm text-slate-100/85">
                Company Verification Details
              </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-sm text-slate-100/85">
                            Fill in the form below in accordance with the{" "}
                            <a
                                href="https://www.lawimperial.com/company-registration-in-nepal/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4 hover:text-white"
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
                                <FieldLabel className="!text-white">
                                    Registered Company Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="ABC Driving Center"
                                    className={inputClassName}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="regNo"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">Registration No.</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="123456789"
                                    className={inputClassName}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="companyType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="!text-white">Company Type</FieldLabel>
                                <select {...field} className={selectClassName}>
                                    <option value="" className="bg-slate-100 text-slate-700">
                                        Select Type
                                    </option>
                                    <option value="public" className="bg-slate-100 text-slate-700">
                                        Public
                                    </option>
                                    <option value="private" className="bg-slate-100 text-slate-700">
                                        Private
                                    </option>
                                    <option value="nonprofit" className="bg-slate-100 text-slate-700">
                                        Non-Profit
                                    </option>
                                </select>
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
                            {isSubmitting ? "Submitting..." : "Register"}
                        </Button>
                    </Field>

                    <FieldDescription className="text-center text-slate-100/85">
                        A registration request is created once the form is submitted. The
                        form will be verified by DriveHub. If it is successfully verified,
                        an email will be sent to the provided email with the log-in
                        credentials for your new dashboard.
                    </FieldDescription>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}