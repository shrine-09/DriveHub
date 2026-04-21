import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, Search, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserLayout from "@/components/user/UserLayout";
import { getPublicDrivingCenters } from "@/services/auth/authServices";

type DrivingCenterPackage = {
    id: number;
    serviceType: string;
    durationInDays: number;
    priceNpr: number;
};

type PublicDrivingCenter = {
    id: number;
    companyName: string;
    companyEmail: string;
    companyContact: string;
    companyType: string;
    address: string | null;
    district: string | null;
    municipality: string | null;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    packages: DrivingCenterPackage[];
};

export default function UserDashboard() {
    const name = localStorage.getItem("name") || "User";

    const [centers, setCenters] = useState<PublicDrivingCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadCenters = async () => {
            try {
                const data = await getPublicDrivingCenters();
                setCenters(data.slice(0, 3));
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load featured driving centers."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadCenters();
    }, []);

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
                        <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-slate-100 hover:bg-white/10">
                            Welcome back
                        </Badge>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Welcome, {name}
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-100/90 md:text-base">
                                Discover verified driving centers, compare services, and explore
                                locations on a map to find the one that fits you best.
                            </p>
                        </div>

                        <div className="max-w-2xl">
                            <Input
                                placeholder="Search driving centers by name or location"
                                className="border-white/20 bg-white/10 text-white placeholder:text-slate-200/80"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                asChild
                                className="bg-white text-[#1E3A5F] hover:bg-slate-100"
                            >
                                <Link to="/user/search">
                                    <Search className="mr-2 size-4" />
                                    Search Centers
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                <Link to="/user/map">
                                    <MapPinned className="mr-2 size-4" />
                                    Explore on Map
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Featured Driving Centers
                            </h2>
                            <p className="text-sm text-slate-600">
                                A few highlighted centers to help you get started.
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            asChild
                            className="text-slate-700 hover:text-[#2563EB]"
                        >
                            <Link to="/user/search">
                                View all
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardContent className="py-10 text-center text-sm text-slate-500">
                                Loading featured centers...
                            </CardContent>
                        </Card>
                    ) : centers.length === 0 ? (
                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardContent className="py-10 text-center text-sm text-slate-500">
                                No featured driving centers available right now.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-3">
                            {centers.map((center) => (
                                <Card
                                    key={center.id}
                                    className="h-full border-slate-200/70 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <CardTitle className="text-lg text-slate-900">
                                                    {center.companyName}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-slate-600">
                                                    {[center.municipality, center.district]
                                                        .filter(Boolean)
                                                        .join(", ") || "Location not available"}
                                                </CardDescription>
                                            </div>

                                            <Badge className="gap-1 border border-blue-200 bg-blue-50 text-[#2563EB] hover:bg-blue-50">
                                                <BadgeCheck className="size-3.5" />
                                                Verified
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex h-full flex-col space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Type</span>
                                            <Badge
                                                variant="secondary"
                                                className="bg-slate-100 text-slate-700"
                                            >
                                                {center.companyType}
                                            </Badge>
                                        </div>

                                        <div className="text-sm">
                                            <p className="text-slate-600">Starting from</p>
                                            <p className="font-medium text-slate-900">
                                                {center.packages.length > 0
                                                    ? `NPR ${Math.min(...center.packages.map((p) => p.priceNpr))}`
                                                    : "Price not available"}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <Button
                                                asChild
                                                className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                            >
                                                <Link to={`/user/centers/${center.id}`}>View Center</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </UserLayout>
    );
}