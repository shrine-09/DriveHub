import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { resendOtp, verifyOtp } from "@/services/auth/authServices";

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otpCode, setOtpCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const handleVerifyOtp = async () => {
        if (!email) {
            setStatusMessage("Verification email is missing. Please log in again.");
            setStatusType("error");
            return;
        }

        if (otpCode.trim().length !== 6) {
            setStatusMessage("Please enter the 6-digit verification code.");
            setStatusType("error");
            return;
        }

        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const data = await verifyOtp(email, otpCode.trim());

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem(
                "mustChangePassword",
                String(data.mustChangePassword ?? false)
            );
            localStorage.setItem(
                "isProfileComplete",
                String(data.isProfileComplete ?? true)
            );

            setStatusMessage("Verification successful.");
            setStatusType("success");

            setTimeout(() => {
                if (data.role === "Admin") {
                    navigate("/admin/dashboard");
                } else if (data.role === "DrivingCenter") {
                    navigate(
                        data.isProfileComplete
                            ? "/driving-center/dashboard"
                            : "/driving-center/setup-profile"
                    );
                } else {
                    navigate("/user/dashboard");
                }
            }, 800);
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to verify OTP."
            );
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            setStatusMessage("Verification email is missing. Please log in again.");
            setStatusType("error");
            return;
        }

        setIsResending(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const data = await resendOtp(email);
            setStatusMessage(data.message || "A new verification code has been sent.");
            setStatusType("success");
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to resend OTP."
            );
            setStatusType("error");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] px-6 py-10 text-[#1E293B]">
            <div className="mx-auto max-w-md space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-8 text-white shadow-sm">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Email Verification
                        </p>
                        <h1 className="text-3xl font-bold">Verify Your Account</h1>
                        <p className="text-sm text-slate-100/90">
                            Enter the 6-digit code sent to {email || "your email"}.
                        </p>
                    </div>
                </div>

                {statusMessage && (
                    <div
                        className={`rounded-md border px-4 py-3 text-sm ${
                            statusType === "success"
                                ? "border-green-500/30 bg-green-500/10 text-green-700"
                                : "border-red-500/30 bg-red-500/10 text-red-700"
                        }`}
                    >
                        {statusMessage}
                    </div>
                )}

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Verification Code</CardTitle>
                        <CardDescription className="text-slate-600">
                            Please check your inbox and enter the OTP below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Enter 6-digit OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={6}
                            className="h-12 text-base text-center tracking-[0.3em] text-slate-900"
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isSubmitting}
                                className="flex-1 bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                            >
                                {isSubmitting ? "Verifying..." : "Verify OTP"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResendOtp}
                                disabled={isResending}
                                className="border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                            >
                                {isResending ? "Sending..." : "Resend"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}