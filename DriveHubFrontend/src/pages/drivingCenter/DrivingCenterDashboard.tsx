import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    MapPinned,
    Package2,
    CircleCheckBig,
    Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import UserLayout from "@/components/user/UserLayout";
import { getDrivingCenterDashboardSummary } from "@/services/auth/authServices";

type DrivingCenterDashboardSummary = {
    companyName: string;
    isProfileComplete: boolean;
    address: string | null;
    district: string | null;
    municipality: string | null;
    packagesCount: number;
};

export default function DrivingCenterDashboard() {
    const [summary, setSummary] = useState<DrivingCenterDashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await getDrivingCenterDashboardSummary();
                setSummary(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load dashboard summary."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadSummary();
    }, []);

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                    <div className="space-y-4">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Driving Center Dashboard
                        </p>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                {isLoading
                                    ? "Loading dashboard..."
                                    : `Welcome, ${summary?.companyName ?? "Driving Center"}`}
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-100/90 md:text-base">
                                View your saved location and service setup, and manage your
                                center profile from one place.
                            </p>
                        </div>

                        <div>
                            <Button
                                asChild
                                className="bg-white text-[#1E3A5F] hover:bg-slate-100"
                            >
                                <Link to="/driving-center/profile">Manage Profile</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading dashboard...
                        </CardContent>
                    </Card>
                ) : summary ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-3">
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                        <CircleCheckBig className="size-4 text-[#3B82F6]" />
                                        Profile Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {summary.isProfileComplete ? "Complete" : "Incomplete"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Your public center profile setup status
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                        <Package2 className="size-4 text-[#3B82F6]" />
                                        Service Packages
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {summary.packagesCount}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Total saved service and duration combinations
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                        <Building2 className="size-4 text-[#3B82F6]" />
                                        District
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {summary.district || "Not set"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Saved location district
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        <section>
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Location Overview</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Public location information currently saved for your center.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPinned className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {summary.address || "No address saved"}
                                            </p>
                                            <p className="text-slate-600">
                                                {[summary.municipality, summary.district]
                                                    .filter(Boolean)
                                                    .join(", ") || "No municipality/district saved"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </>
                ) : null}
            </div>
        </UserLayout>
    );
}