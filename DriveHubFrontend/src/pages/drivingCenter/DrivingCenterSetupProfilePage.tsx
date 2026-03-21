import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { setupDrivingCenterProfile } from "@/services/auth/authServices";

type PackageItem = {
    serviceType: string;
    durationType: string;
    priceNpr: string;
};

export default function DrivingCenterSetupProfilePage() {
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");

    const [packages, setPackages] = useState<PackageItem[]>([
        { serviceType: "Bike", durationType: "2Weeks", priceNpr: "" },
        { serviceType: "Bike", durationType: "1Month", priceNpr: "" },
        { serviceType: "Scooter", durationType: "2Weeks", priceNpr: "" },
        { serviceType: "Scooter", durationType: "1Month", priceNpr: "" },
        { serviceType: "Car", durationType: "2Weeks", priceNpr: "" },
        { serviceType: "Car", durationType: "1Month", priceNpr: "" },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const updatePackagePrice = (index: number, value: string) => {
        setPackages((prev) =>
            prev.map((pkg, i) => (i === index ? { ...pkg, priceNpr: value } : pkg))
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const filteredPackages = packages
                .filter((pkg) => pkg.priceNpr.trim() !== "")
                .map((pkg) => ({
                    serviceType: pkg.serviceType,
                    durationType: pkg.durationType,
                    priceNpr: Number(pkg.priceNpr),
                }));

            await setupDrivingCenterProfile({
                address,
                district,
                municipality,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
                description,
                packages: filteredPackages,
            });

            localStorage.setItem("isProfileComplete", "true");
            setStatusMessage("Profile setup completed successfully.");
            setStatusType("success");

            setTimeout(() => {
                navigate("/driving-center/dashboard");
            }, 1200);
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to save driving center profile."
            );
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] px-6 py-10 text-[#1E293B]">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-8 text-white shadow-sm">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Driving Center Setup
                        </p>
                        <h1 className="text-3xl font-bold md:text-4xl">
                            Complete your center profile
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-100/90 md:text-base">
                            Add your location, service details, and pricing before accessing
                            the full dashboard.
                        </p>
                    </div>
                </div>

                {statusMessage && (
                    <div
                        className={`rounded-md border px-4 py-3 text-sm ${
                            statusType === "success"
                                ? "border-green-500/30 bg-green-500/10 text-green-700"
                                : "border-red-500/30 bg-red-500/10 text-red-700"
                        }`}
                    >
                        {statusMessage}
                    </div>
                )}

                <Card className="border-slate-200/60 bg-white/90 shadow-sm">
                    <CardHeader>
                        <CardTitle>Location & Contact Details</CardTitle>
                        <CardDescription>
                            Add the public location details users will see.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Input
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <Input
                            placeholder="District"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        />
                        <Input
                            placeholder="Municipality"
                            value={municipality}
                            onChange={(e) => setMunicipality(e.target.value)}
                        />
                        <Input
                            placeholder="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                        <Input
                            placeholder="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                        <Input
                            placeholder="Short description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 bg-white/90 shadow-sm">
                    <CardHeader>
                        <CardTitle>Packages & Pricing</CardTitle>
                        <CardDescription>
                            Set prices in NPR for the services you offer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {packages.map((pkg, index) => (
                            <div
                                key={`${pkg.serviceType}-${pkg.durationType}`}
                                className="grid gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4 md:grid-cols-3"
                            >
                                <div>
                                    <p className="text-sm text-slate-500">Service</p>
                                    <p className="font-medium">{pkg.serviceType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Duration</p>
                                    <p className="font-medium">{pkg.durationType}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-slate-500">Price (NPR)</p>
                                    <Input
                                        placeholder="Enter price"
                                        value={pkg.priceNpr}
                                        onChange={(e) => updatePackagePrice(index, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                    >
                        {isSubmitting ? "Saving..." : "Complete Setup"}
                    </Button>
                </div>
            </div>
        </div>
    );
}