import UserNavbar from "@/components/user/UserNavbar";

type UserLayoutProps = {
    children: React.ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground scroll-smooth">
            <UserNavbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
                {children}
            </main>
        </div>
    );
}