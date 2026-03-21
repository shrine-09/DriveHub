import { Link } from "react-router-dom";

type AuthLayoutProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

export default function AuthLayout({
                                       title,
                                       description,
                                       children,
                                   }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F8F7F4] text-[#1E293B]">
            {/* Background image / gradient feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#F8F7F4]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.28),transparent_30%)]" />

            {/* Top brand */}
            <header className="relative z-10 w-full px-6 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white drop-shadow-sm"
                    >
                        DriveHub
                    </Link>
                </div>
            </header>

            {/* Centered auth card */}
            <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-10">
                <div className="w-full max-w-md rounded-3xl border border-white/25 bg-white/16 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="mb-6 space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm leading-6 text-slate-100/85">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
}