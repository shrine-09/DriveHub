import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel, FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerCenter} from "@/services/auth/authServices.tsx";

const centerSchema = z.object({
    centerEmail: z.email("Enter a valid email address"),
    centerContact: z.string("Enter contact information").regex(/^\d+$/, "Enter a valid contact number"),
    companyName: z.string().min(2, "Enter a valid company name"),
    regNo: z.string("Enter registration number").regex(/^\d+$/, "Enter a valid registration number"),
    companyType: z.enum(["public", "private", "nonprofit"], {
        message: "Select a company type"
    }).optional()
})

type CenterFormType = z.infer<typeof centerSchema>

export function CentersRegisterForm({
                               className,
                               ...props
                           }: React.ComponentProps<"form">) {
    const form = useForm<CenterFormType> ({
        resolver: zodResolver(centerSchema),
        defaultValues: {
            centerEmail: "",
            centerContact: "",
            companyName: "",
            regNo: "",
            companyType: undefined
        }
    })
    
    const handleCenterRegister = async (data: CenterFormType) => {
        try {
            const response = await registerCenter(
                data.centerEmail,
                data.centerContact,
                data.companyName,
                data.regNo,
                data.companyType
            );
            console.log("Registration Successful:", response);
            alert("Registration Submitted Successfully");
        } catch (error: any) {
            if (error.response){
                const data = error.response.data;
                const messages = Object.values(data.errors)
                    .flat() 
                    .join("\n"); 
                alert(`Registration Failed:\n${messages}`);
            } else {
                alert("Error connection to backend.")
            }
        }
    };
    
    return (
        <form className={cn("flex flex-col gap-6", className)} 
              {...props}
            onSubmit={form.handleSubmit(handleCenterRegister)}
        >
            <FieldGroup>
                <h1 className="text-2xl text-center mt-15" style={{ fontWeight:500 }}>Register Driving Center</h1>
                
                <Controller
                    name={"centerEmail"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input {...field} placeholder={"example@email.com"} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={"centerContact"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Contact No.</FieldLabel>
                            <Input {...field} placeholder={"111-222-3333"} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                
                <FieldSeparator>
                </FieldSeparator>
                
                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-sm text-balance text-shadow-primary">
                        Fill in the form below in accordance to the &nbsp;
                        <a 
                            href={"https://www.lawimperial.com/company-registration-in-nepal/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={"underline hover:text-primary/80"}
                        >
                            Certificate of Incorporation of Company
                        </a>
                    </p>
                </div>
                
                <Controller
                    name={"companyName"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Registered Company Name</FieldLabel>
                            <Input {...field} placeholder={"ABC Driving Center"} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={"regNo"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Registration No.</FieldLabel>
                            <Input {...field} placeholder={""} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={"companyType"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Company Type</FieldLabel>
                            <select
                                {...field}
                                className={"border bg-background p-2 rounded-md"}
                            >
                                <option value={""}>Select Type</option>
                                <option value={"public"}>Public</option>
                                <option value={"private"}>Private</option>
                                <option value={"nonprofit"}>Non-Profit</option>
                            </select>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                
                
                <Field>
                    <Button type="submit">Register</Button>
                </Field>
                
                <FieldDescription className={"text-center"}>
                    A register request is created once the form is submitted, 
                    the form will be verified by DriveHub. If the form is successfully verified,
                    an email will be sent to the provided email with the log-in credentials 
                    for your new dashboard technology.
                </FieldDescription>
                
            </FieldGroup>
        </form>
    )
}
