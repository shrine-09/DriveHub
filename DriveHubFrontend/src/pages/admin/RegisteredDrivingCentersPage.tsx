import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisteredDrivingCentersPage() {
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
                                This page will show all approved and registered driving centers.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Driving Centers</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Registered driving center listing, details, and management features will be added here.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}