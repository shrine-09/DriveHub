import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import UserLayout from "@/components/user/UserLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicDrivingCenters } from "@/services/auth/authServices";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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

export default function UserMapPage() {
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
                    error.response?.data?.message || "Failed to load map data."
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
            const searchableText = [
                center.companyName,
                center.address,
                center.municipality,
                center.district,
                center.companyType,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(search);
        });
    }, [centers, searchTerm]);

    const centersWithCoordinates = useMemo(() => {
        return filteredCenters.filter(
            (center) => center.latitude !== null && center.longitude !== null
        );
    }, [filteredCenters]);

    const defaultCenter: [number, number] =
        centersWithCoordinates.length > 0
            ? [
                centersWithCoordinates[0].latitude as number,
                centersWithCoordinates[0].longitude as number,
            ]
            : [27.7172, 85.324]; // Kathmandu fallback

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Explore on Map
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-100/90 md:text-base">
                                View verified driving centers on the map and open their details.
                            </p>
                        </div>

                        <div className="max-w-2xl">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or location..."
                                className="border-white/20 bg-white/10 text-white placeholder:text-slate-200/80"
                            />
                        </div>
                    </div>
                </section>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-2xl border border-slate-200/70 bg-white/95 px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
                        Loading map...
                    </div>
                ) : centersWithCoordinates.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/70 bg-white/95 px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
                        No driving centers with map coordinates are available for this search.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm">
                        <MapContainer
                            center={defaultCenter}
                            zoom={12}
                            style={{ height: "650px", width: "100%" }}
                            scrollWheelZoom
                        >
                            <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {centersWithCoordinates.map((center) => {
                                const startingPrice =
                                    center.packages.length > 0
                                        ? Math.min(...center.packages.map((p) => p.priceNpr))
                                        : null;

                                return (
                                    <Marker
                                        key={center.id}
                                        position={[center.latitude as number, center.longitude as number]}
                                    >
                                        <Popup>
                                            <div className="space-y-3 min-w-[220px]">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {center.companyName}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {[center.municipality, center.district]
                                                            .filter(Boolean)
                                                            .join(", ") || "Location not available"}
                                                    </p>
                                                </div>

                                                <Badge className="border border-blue-200 bg-blue-50 text-[#2563EB] hover:bg-blue-50">
                                                    {center.companyType}
                                                </Badge>

                                                <div className="text-sm">
                                                    <p className="text-slate-500">Starting from</p>
                                                    <p className="font-medium text-slate-900">
                                                        {startingPrice !== null
                                                            ? `NPR ${startingPrice}`
                                                            : "Price not available"}
                                                    </p>
                                                </div>

                                                <Button
                                                    asChild
                                                    className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                                >
                                                    <Link to={`/user/centers/${center.id}`}>View Center</Link>
                                                </Button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}