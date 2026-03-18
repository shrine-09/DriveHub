import { Button } from "@/components/ui/button.tsx";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient.tsx";
import { useNavigate } from "react-router-dom";
import roadBg from "@/assets/road-bg.png";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#2F2F2F]">
            {/* Hero Section */}
            <section className="relative min-h-screen overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${roadBg})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

                {/* Soft warm tint */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(236,167,44,0.18),transparent_40%,rgba(0,0,0,0.15))]" />

                {/* Navbar */}
                <header className="absolute top-0 left-0 z-20 w-full">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                        <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                            DriveHub
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => navigate("/login")}
                                className="cursor-pointer rounded-md border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                Log in
                            </Button>

                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                onClick={() => navigate("/register")}
                                className="flex cursor-pointer items-center space-x-2 bg-white text-sm font-semibold text-black"
                            >
                                Join Us
                            </HoverBorderGradient>
                        </div>
                    </div>
                </header>

                {/* Hero Content */}
                <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex rounded-full border border-[#ECA72C]/30 bg-[#ECA72C]/15 px-4 py-1 text-sm font-medium text-[#ffd58a] backdrop-blur-sm">
                            Find the right driving center with confidence
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                                DriveHub
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-white/85 md:text-lg">
                                Discover verified driving centers, compare services, explore
                                locations on a map, and connect with the right training center
                                for your journey.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                onClick={() => navigate("/register")}
                                className="cursor-pointer bg-[#F95738] px-6 py-6 text-base font-semibold text-white hover:bg-[#f26a50]"
                            >
                                Get Started
                            </Button>

                            <Button
                                onClick={() => navigate("/login")}
                                variant="outline"
                                className="cursor-pointer border-white/20 bg-white/10 px-6 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                Already have an account?
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple lower section to blend into light theme */}
            <section className="bg-[#F8F7F4] px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-2 text-lg font-semibold text-[#2F2F2F]">
                                Verified Centers
                            </h3>
                            <p className="text-sm leading-6 text-[#5b5b5b]">
                                Explore trusted driving centers with real information and
                                approval-based registration.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-2 text-lg font-semibold text-[#2F2F2F]">
                                Search & Map Discovery
                            </h3>
                            <p className="text-sm leading-6 text-[#5b5b5b]">
                                Search by name or location and browse driving centers visually
                                on the map.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-2 text-lg font-semibold text-[#2F2F2F]">
                                Built for Nepal
                            </h3>
                            <p className="text-sm leading-6 text-[#5b5b5b]">
                                A platform designed to make driving center discovery and
                                management simpler and more organized.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}