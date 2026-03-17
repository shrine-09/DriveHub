import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    approveDrivingCenterApplication,
    getPendingDrivingCenterApplications,
    rejectDrivingCenterApplication,
} from "@/services/admin/adminServices";
import { Input } from "@/components/ui/input";

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

export default function PendingDrivingCentersPage() {
    const [applications, setApplications] = useState<PendingDrivingCenterApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionId, setActionId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPendingApplications = async () => {
        setIsLoading(true);
        try {
            const data = await getPendingDrivingCenterApplications();
            setApplications(data);
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to load pending applications."
            );
            setStatusType("error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingApplications();
    }, []);

    const handleApprove = async (id: number) => {
        setActionId(id);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await approveDrivingCenterApplication(id);

            setStatusMessage(
                response.message || "Application approved successfully."
            );
            setStatusType("success");

            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to approve application."
            );
            setStatusType("error");
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (id: number) => {
        setActionId(id);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await rejectDrivingCenterApplication(id);

            setStatusMessage(
                response.message || "Application rejected successfully."
            );
            setStatusType("success");

            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to reject application."
            );
            setStatusType("error");
        } finally {
            setActionId(null);
        }
    };

    const filteredApplications = applications.filter((application) => {
        const search = searchTerm.toLowerCase();

        return (
            application.companyName.toLowerCase().includes(search) ||
            application.registrationNumber.toLowerCase().includes(search)
        );
    });
    
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
                                Pending Driving Center Applications
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Review and manage new driving center registration requests.
                            </p>
                        </div>

                        <div className="max-w-md">
                            <Input
                                placeholder="Search by company name or registration number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {statusMessage && (
                            <div
                                className={`rounded-md border px-4 py-3 text-sm whitespace-pre-line ${
                                    statusType === "success"
                                        ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                                        : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                                }`}
                            >
                                {statusMessage}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Loading applications...</div>
                        ) : filteredApplications.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    No pending driving center applications right now.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {filteredApplications.map((application) => (
                                    <Card
                                        key={application.id}
                                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <CardHeader className="space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        {application.companyName}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        Submitted on{" "}
                                                        {new Date(application.submittedAt).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Registration Number</p>
                                                <p className="font-medium">{application.registrationNumber}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Email</p>
                                                <p className="font-medium break-all">{application.companyEmail}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Contact</p>
                                                <p className="font-medium">{application.companyContact}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Company Type</p>
                                                <p className="font-medium capitalize">{application.companyType}</p>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    className="flex-1"
                                                    disabled={actionId === application.id}
                                                    onClick={() => handleApprove(application.id)}
                                                >
                                                    {actionId === application.id ? "Processing..." : "Approve"}
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    disabled={actionId === application.id}
                                                    onClick={() => handleReject(application.id)}
                                                >
                                                    {actionId === application.id ? "Processing..." : "Reject"}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}