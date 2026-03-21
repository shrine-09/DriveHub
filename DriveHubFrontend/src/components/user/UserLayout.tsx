import UserNavbar from "@/components/user/UserNavbar";

type UserLayoutProps = {
    children: React.ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#1E293B] scroll-smooth">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.14),transparent_28%)]" />
            <UserNavbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
                {children}
            </main>
        </div>
    );
}