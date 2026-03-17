import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRegisteredDrivingCenters } from "@/services/admin/adminServices";

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

export default function RegisteredDrivingCentersPage() {
    const [centers, setCenters] = useState<RegisteredDrivingCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

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
                        ) : centers.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    No registered driving centers found.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {centers.map((center) => (
                                    <Card
                                        key={center.id}
                                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg">{center.companyName}</CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Registration Number</p>
                                                <p className="font-medium">{center.registrationNumber}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Email</p>
                                                <p className="font-medium break-all">{center.companyEmail}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Contact</p>
                                                <p className="font-medium">{center.companyContact}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Company Type</p>
                                                <p className="font-medium capitalize">{center.companyType}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Verification Status</p>
                                                <p className="font-medium">
                                                    {center.isVerified ? "Verified" : "Not Verified"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Linked User ID</p>
                                                <p className="font-medium">{center.userId}</p>
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