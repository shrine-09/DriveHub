import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, MapPinned, Search } from "lucide-react";
import UserLayout from "@/components/user/UserLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function UserSearchPage() {
    const [centers, setCenters] = useState<PublicDrivingCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadCenters = async () => {
            try {
                const data = await getPublicDrivingCenters();
                setCenters(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load driving centers."
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
            const locationText = [
                center.address,
                center.municipality,
                center.district,
                center.companyType,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                center.companyName.toLowerCase().includes(search) ||
                locationText.includes(search)
            );
        });
    }, [centers, searchTerm]);

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Search Driving Centers
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-100/90 md:text-base">
                                Find verified driving centers by company name, address, district,
                                or municipality.
                            </p>
                        </div>

                        <div className="max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-200" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or location..."
                                    className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-slate-200/80"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading driving centers...
                        </CardContent>
                    </Card>
                ) : filteredCenters.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            No driving centers found for your search.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {filteredCenters.map((center) => {
                            const startingPrice =
                                center.packages.length > 0
                                    ? Math.min(...center.packages.map((p) => p.priceNpr))
                                    : null;

                            return (
                                <Card
                                    key={center.id}
                                    className="border-slate-200/70 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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

                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-3 text-sm">
                                            <MapPinned className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {center.address || "No address available"}
                                                </p>
                                                <p className="text-slate-600">
                                                    {[center.municipality, center.district]
                                                        .filter(Boolean)
                                                        .join(", ") || "No municipality/district saved"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                            <div>
                                                <p className="text-slate-600">Type</p>
                                                <p className="font-medium text-slate-900">
                                                    {center.companyType}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-slate-600">Starting from</p>
                                                <p className="font-medium text-slate-900">
                                                    {startingPrice !== null
                                                        ? `NPR ${startingPrice}`
                                                        : "Price not available"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {center.packages.slice(0, 4).map((pkg) => (
                                                <Badge
                                                    key={pkg.id}
                                                    variant="secondary"
                                                    className="bg-slate-100 text-slate-700"
                                                >
                                                    {pkg.serviceType} · {pkg.durationInDays} day{pkg.durationInDays > 1 ? "s" : ""}
                                                </Badge>
                                            ))}
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                        >
                                            <Link to={`/user/centers/${center.id}`}>View Center</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}