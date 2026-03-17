import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    approveDrivingCenterApplication,
    getPendingDrivingCenterApplications,
    rejectDrivingCenterApplication,
} from "@/services/admin/adminServices";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

const PAGE_SIZE = 5;

export default function PendingDrivingCentersPage() {
    const [applications, setApplications] = useState<PendingDrivingCenterApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionId, setActionId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedRejectId, setSelectedRejectId] = useState<number | null>(null);
    const [rejectRemarks, setRejectRemarks] = useState("");

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

    const handleReject = async () => {
        if (selectedRejectId === null) return;

        setActionId(selectedRejectId);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await rejectDrivingCenterApplication(
                selectedRejectId,
                rejectRemarks
            );

            setStatusMessage(
                response.message || "Application rejected successfully."
            );
            setStatusType("success");

            setApplications((prev) =>
                prev.filter((app) => app.id !== selectedRejectId)
            );
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to reject application."
            );
            setStatusType("error");
        } finally {
            setActionId(null);
            setRejectDialogOpen(false);
            setSelectedRejectId(null);
            setRejectRemarks("");
        }
    };

    const filteredApplications = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return applications.filter((application) => {
            return (
                application.companyName.toLowerCase().includes(search) ||
                application.registrationNumber.toLowerCase().includes(search)
            );
        });
    }, [applications, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / PAGE_SIZE));

    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredApplications.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredApplications, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    Loading applications...
                                </CardContent>
                            </Card>
                        ) : filteredApplications.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    No pending driving center applications right now.
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Applications</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="overflow-x-auto rounded-md border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="px-4 py-3 text-left font-medium">ID</th>
                                                <th className="px-4 py-3 text-left font-medium">Company Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Registration No.</th>
                                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                                <th className="px-4 py-3 text-left font-medium">Contact</th>
                                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                                <th className="px-4 py-3 text-left font-medium">Submitted</th>
                                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {paginatedApplications.map((application) => (
                                                <tr
                                                    key={application.id}
                                                    className="border-b transition-colors hover:bg-muted/40"
                                                >
                                                    <td className="px-4 py-3">{application.id}</td>
                                                    <td className="px-4 py-3 font-medium">{application.companyName}</td>
                                                    <td className="px-4 py-3">{application.registrationNumber}</td>
                                                    <td className="px-4 py-3 break-all">{application.companyEmail}</td>
                                                    <td className="px-4 py-3">{application.companyContact}</td>
                                                    <td className="px-4 py-3 capitalize">{application.companyType}</td>
                                                    <td className="px-4 py-3">
                                                        {new Date(application.submittedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                disabled={actionId === application.id}
                                                                onClick={() => handleApprove(application.id)}
                                                            >
                                                                {actionId === application.id ? "..." : "Approve"}
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                disabled={actionId === application.id}
                                                                onClick={() => {
                                                                    setSelectedRejectId(application.id);
                                                                    setRejectRemarks("");
                                                                    setRejectDialogOpen(true);
                                                                }}
                                                            >
                                                                {actionId === application.id ? "..." : "Reject"}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                }
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Application</DialogTitle>
                            <DialogDescription>
                                Add optional remarks to include in the rejection email.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Admin Remarks</label>
                            <Textarea
                                placeholder="Enter reason for rejection..."
                                value={rejectRemarks}
                                onChange={(e) => setRejectRemarks(e.target.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRejectDialogOpen(false);
                                    setSelectedRejectId(null);
                                    setRejectRemarks("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={actionId === selectedRejectId}
                            >
                                {actionId === selectedRejectId ? "Rejecting..." : "Confirm Reject"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    );
}