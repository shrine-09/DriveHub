import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, CalendarDays, MapPinned, Phone, Mail } from "lucide-react";
import UserLayout from "@/components/user/UserLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    bookDrivingCenter,
    getPublicDrivingCenters,
} from "@/services/auth/authServices";

type DrivingCenterPackage = {
    id: number;
    serviceType: string;
    durationType: string;
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

export default function DrivingCenterDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [center, setCenter] = useState<PublicDrivingCenter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const [selectedServiceType, setSelectedServiceType] = useState("");
    const [selectedDurationType, setSelectedDurationType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadCenter = async () => {
            try {
                const data = await getPublicDrivingCenters();
                const matchedCenter = data.find((item: PublicDrivingCenter) => String(item.id) === id);
                if (!matchedCenter) {
                    setStatusMessage("Driving center not found.");
                    setStatusType("error");
                } else {
                    setCenter(matchedCenter);
                }
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load driving center details."
                );
                setStatusType("error");
            } finally {
                setIsLoading(false);
            }
        };

        loadCenter();
    }, [id]);

    const availableServices = useMemo(() => {
        if (!center) return [];
        return [...new Set(center.packages.map((pkg) => pkg.serviceType))];
    }, [center]);

    const availableDurations = useMemo(() => {
        if (!center || !selectedServiceType) return [];
        return [
            ...new Set(
                center.packages
                    .filter((pkg) => pkg.serviceType === selectedServiceType)
                    .map((pkg) => pkg.durationType)
            ),
        ];
    }, [center, selectedServiceType]);

    const selectedPackage = useMemo(() => {
        if (!center || !selectedServiceType || !selectedDurationType) return null;

        return (
            center.packages.find(
                (pkg) =>
                    pkg.serviceType === selectedServiceType &&
                    pkg.durationType === selectedDurationType
            ) || null
        );
    }, [center, selectedDurationType, selectedServiceType]);

    const handleBooking = async () => {
        setStatusMessage("");
        setStatusType("");

        if (!center) return;

        if (!selectedServiceType) {
            setStatusMessage("Please select a service.");
            setStatusType("error");
            return;
        }

        if (!selectedDurationType) {
            setStatusMessage("Please select a duration.");
            setStatusType("error");
            return;
        }

        if (!startDate) {
            setStatusMessage("Please select a start date.");
            setStatusType("error");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await bookDrivingCenter({
                drivingCenterId: center.id,
                serviceType: selectedServiceType,
                durationType: selectedDurationType,
                startDate,
            });

            setStatusMessage(response.message || "Booking request submitted successfully.");
            setStatusType("success");

            setTimeout(() => {
                navigate("/user/dashboard");
            }, 1200);
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat().join("\n");
                setStatusMessage(messages);
            } else {
                setStatusMessage("Failed to submit booking request.");
            }
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading driving center details...
                        </CardContent>
                    </Card>
                ) : !center ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Driving center not found.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className="gap-1 border border-white/20 bg-white/10 text-slate-100 hover:bg-white/10">
                                                <BadgeCheck className="size-3.5" />
                                                Verified
                                            </Badge>
                                            <Badge className="border border-white/20 bg-white/10 text-slate-100 hover:bg-white/10">
                                                {center.companyType}
                                            </Badge>
                                        </div>

                                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                            {center.companyName}
                                        </h1>

                                        <p className="max-w-3xl text-sm leading-6 text-slate-100/90 md:text-base">
                                            {center.description || "No description available for this driving center yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {statusMessage && (
                            <div
                                className={`rounded-md border px-4 py-3 text-sm whitespace-pre-line ${
                                    statusType === "success"
                                        ? "border-green-500/30 bg-green-500/10 text-green-700"
                                        : "border-red-500/30 bg-red-500/10 text-red-700"
                                }`}
                            >
                                {statusMessage}
                            </div>
                        )}

                        <section className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">Center Information</CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Contact and location details.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div className="flex items-start gap-3">
                                            <MapPinned className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {center.address || "No address available"}
                                                </p>
                                                <p className="text-slate-600">
                                                    {[center.municipality, center.district].filter(Boolean).join(", ") ||
                                                        "No municipality/district saved"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">Contact</p>
                                                <p className="text-slate-600">{center.companyContact}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">Email</p>
                                                <p className="break-all text-slate-600">{center.companyEmail}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">Available Packages</CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Current services and package pricing.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 md:grid-cols-2">
                                        {center.packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-slate-900">
                                                        {pkg.serviceType}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{pkg.durationType}</p>
                                                    <p className="text-sm font-medium text-[#2563EB]">
                                                        NPR {pkg.priceNpr}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">Book a Package</CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Choose a service, duration, and preferred start date.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Service
                                            </label>
                                            <select
                                                value={selectedServiceType}
                                                onChange={(e) => {
                                                    setSelectedServiceType(e.target.value);
                                                    setSelectedDurationType("");
                                                }}
                                                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                            >
                                                <option value="">Select service</option>
                                                {availableServices.map((service) => (
                                                    <option key={service} value={service}>
                                                        {service}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Duration
                                            </label>
                                            <select
                                                value={selectedDurationType}
                                                onChange={(e) => setSelectedDurationType(e.target.value)}
                                                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                            >
                                                <option value="">Select duration</option>
                                                {availableDurations.map((duration) => (
                                                    <option key={duration} value={duration}>
                                                        {duration}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Start Date
                                            </label>
                                            <div className="relative">
                                                <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="pl-10 text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm">
                                            <p className="font-medium text-slate-900">Selected Package</p>
                                            {selectedPackage ? (
                                                <div className="mt-2 space-y-1 text-slate-600">
                                                    <p>
                                                        {selectedPackage.serviceType} · {selectedPackage.durationType}
                                                    </p>
                                                    <p className="font-medium text-[#2563EB]">
                                                        NPR {selectedPackage.priceNpr}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-slate-500">
                                                    Select a service and duration to view package details.
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={handleBooking}
                                            disabled={isSubmitting}
                                            className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                        >
                                            {isSubmitting ? "Submitting..." : "Send Booking Request"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </UserLayout>
    );
}