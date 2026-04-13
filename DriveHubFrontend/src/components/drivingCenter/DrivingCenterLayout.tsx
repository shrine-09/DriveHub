import { useState } from "react";
import { Menu } from "lucide-react";
import DrivingCenterSidebar from "@/components/drivingCenter/DrivingCenterSidebar";
import { Button } from "@/components/ui/button";

type DrivingCenterLayoutProps = {
    children: React.ReactNode;
};

export default function DrivingCenterLayout({
                                                children,
                                            }: DrivingCenterLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#1E293B]">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.14),transparent_28%)]" />

            <div className="flex min-h-screen items-start">
                <DrivingCenterSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <div>
                            <p className="text-sm text-slate-500">DriveHub</p>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Driving Center Panel
                            </h2>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSidebarOpen(true)}
                            className="border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}