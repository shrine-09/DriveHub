import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRegisteredDrivingCenters } from "@/services/admin/adminServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RegisteredDrivingCenter = {
    id: number;
    companyName: string;
    registrationNumber: string;
    companyEmail: string;
    companyContact: string;
    companyType: string;
    isVerified: boolean;
    userId: number;
};

const PAGE_SIZE = 5;

export default function RegisteredDrivingCentersPage() {
    const [centers, setCenters] = useState<RegisteredDrivingCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadCenters = async () => {
            try {
                const data = await getRegisteredDrivingCenters();
                setCenters(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load registered driving centers."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadCenters();
    }, []);

    const filteredCenters = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return centers.filter((center) => {
            return (
                center.companyName.toLowerCase().includes(search) ||
                center.registrationNumber.toLowerCase().includes(search)
            );
        });
    }, [centers, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredCenters.length / PAGE_SIZE));

    const paginatedCenters = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredCenters.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredCenters, currentPage]);

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
                                Registered Driving Centers
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                View all approved and registered driving centers in the system.
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
                            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                                {statusMessage}
                            </div>
                        )}

                        {isLoading ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    Loading registered driving centers...
                                </CardContent>
                            </Card>
                        ) : filteredCenters.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    No registered driving centers found.
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Driving Centers</CardTitle>
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
                                                <th className="px-4 py-3 text-left font-medium">Verified</th>
                                                <th className="px-4 py-3 text-left font-medium">User ID</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {paginatedCenters.map((center) => (
                                                <tr
                                                    key={center.id}
                                                    className="border-b transition-colors hover:bg-muted/40"
                                                >
                                                    <td className="px-4 py-3">{center.id}</td>
                                                    <td className="px-4 py-3 font-medium">{center.companyName}</td>
                                                    <td className="px-4 py-3">{center.registrationNumber}</td>
                                                    <td className="px-4 py-3 break-all">{center.companyEmail}</td>
                                                    <td className="px-4 py-3">{center.companyContact}</td>
                                                    <td className="px-4 py-3 capitalize">{center.companyType}</td>
                                                    <td className="px-4 py-3">
                                                        {center.isVerified ? "Verified" : "Not Verified"}
                                                    </td>
                                                    <td className="px-4 py-3">{center.userId}</td>
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
            </SidebarInset>
        </SidebarProvider>
    );
}