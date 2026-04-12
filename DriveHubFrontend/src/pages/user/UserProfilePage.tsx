import { Link } from "react-router-dom";
import UserLayout from "@/components/user/UserLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UserProfilePage() {
    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "No email available";

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-8">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Profile
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="max-w-2xl text-sm text-slate-100/90">
                            Manage your account information and security settings from here.
                        </p>
                    </div>
                </div>

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Account Information</CardTitle>
                        <CardDescription className="text-slate-600">
                            Your current account details.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-sm text-slate-500">Full Name</p>
                                <p className="mt-1 text-lg font-semibold text-slate-900">
                                    {name}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="mt-1 break-all text-lg font-semibold text-slate-900">
                                    {email}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                asChild
                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                            >
                                <Link to="/change-password">Change Password</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}