import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Clock3, ArrowRight } from "lucide-react";
import { getPendingDrivingCenterApplications } from "@/services/admin/adminServices";
import apiClient from "@/services/apiClient";

type DashboardSummary = {
    totalUsers: number;
    totalDrivingCenters: number;
    pendingApplications: number;
};

type PendingDrivingCenterApplication = {
    id: number;
    companyName: string;
    registrationNumber: string;
    companyEmail: string;
    companyContact: string;
    companyType: string;
    status: string;
    submittedAt: string;
};

export default function AdminDashboard() {
    const [summary, setSummary] = useState<DashboardSummary>({
        totalUsers: 0,
        totalDrivingCenters: 0,
        pendingApplications: 0,
    });
    const [pendingPreview, setPendingPreview] = useState<PendingDrivingCenterApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [summaryResponse, pendingResponse] = await Promise.all([
                    apiClient.get("/api/admin/dashboard-summary"),
                    getPendingDrivingCenterApplications(),
                ]);

                setSummary(summaryResponse.data);
                setPendingPreview(pendingResponse.slice(0, 3));
            } catch (error) {
                console.error("Failed to load admin dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Monitor users, driving centers, and pending registration requests.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                    <Users className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isLoading ? "..." : summary.totalUsers}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Registered normal users in the platform
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Driving Centers</CardTitle>
                                    <Building2 className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isLoading ? "..." : summary.totalDrivingCenters}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Approved and registered driving centers
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                                    <Clock3 className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isLoading ? "..." : summary.pendingApplications}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Applications waiting for admin review
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card className="transition-all duration-300 hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Jump straight into key admin tasks.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <Button asChild>
                                        <Link to="/admin/driving-centers/pending">
                                            Review Pending Applications
                                        </Link>
                                    </Button>

                                    <Button variant="outline" asChild>
                                        <Link to="/admin/users">Manage Users</Link>
                                    </Button>

                                    <Button variant="outline" asChild>
                                        <Link to="/admin/driving-centers/registered">
                                            View Registered Centers
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="transition-all duration-300 hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <CardTitle>Latest Pending Applications</CardTitle>
                                            <CardDescription>
                                                A quick preview of the newest requests.
                                            </CardDescription>
                                        </div>

                                        <Button variant="ghost" asChild>
                                            <Link to="/admin/driving-centers/pending">
                                                View all
                                                <ArrowRight className="ml-2 size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {isLoading ? (
                                        <p className="text-sm text-muted-foreground">Loading preview...</p>
                                    ) : pendingPreview.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No pending applications right now.
                                        </p>
                                    ) : (
                                        pendingPreview.map((application) => (
                                            <div
                                                key={application.id}
                                                className="rounded-lg border p-3 transition-all duration-300 hover:bg-muted/40"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium">{application.companyName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {application.companyEmail}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}