import DrivingCenterSidebar from "@/components/drivingCenter/DrivingCenterSidebar";

type DrivingCenterLayoutProps = {
    children: React.ReactNode;
};

export default function DrivingCenterLayout({
                                                children,
                                            }: DrivingCenterLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#1E293B]">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.14),transparent_28%)]" />
            <div className="flex min-h-screen items-start">
                <DrivingCenterSidebar />
                <main className="flex-1 px-6 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}