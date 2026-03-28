import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
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
import LocationPickerMap from "@/components/drivingCenter/LocationPickerMap";

type PackageItem = {
    serviceType: string;
    durationInDays: string;
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
        { serviceType: "", durationInDays: "", priceNpr: "" },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const parsedLatitude = latitude ? Number(latitude) : null;
    const parsedLongitude = longitude ? Number(longitude) : null;

    const handleMapLocationChange = (lat: number, lng: number) => {
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
    };

    const updatePackage = (
        index: number,
        field: keyof PackageItem,
        value: string
    ) => {
        setPackages((prev) =>
            prev.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg))
        );
    };

    const addServiceCard = () => {
        setPackages((prev) => [
            ...prev,
            { serviceType: "", durationInDays: "", priceNpr: "" },
        ]);
    };

    const removeServiceCard = (index: number) => {
        setPackages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!address.trim()) {
            setStatusMessage("Please enter the driving center address.");
            setStatusType("error");
            return false;
        }

        if (!district.trim()) {
            setStatusMessage("Please enter the district.");
            setStatusType("error");
            return false;
        }

        if (!municipality.trim()) {
            setStatusMessage("Please enter the municipality.");
            setStatusType("error");
            return false;
        }

        if (!latitude.trim() || !longitude.trim()) {
            setStatusMessage("Please provide both latitude and longitude.");
            setStatusType("error");
            return false;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            setStatusMessage("Please enter a valid latitude between -90 and 90.");
            setStatusType("error");
            return false;
        }

        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            setStatusMessage("Please enter a valid longitude between -180 and 180.");
            setStatusType("error");
            return false;
        }

        const completePackages = packages.filter(
            (pkg) =>
                pkg.serviceType.trim() !== "" &&
                pkg.durationInDays.trim() !== "" &&
                pkg.priceNpr.trim() !== ""
        );

        if (completePackages.length === 0) {
            setStatusMessage("Please add at least one complete service package.");
            setStatusType("error");
            return false;
        }

        for (const pkg of packages) {
            const isCompletelyEmpty =
                pkg.serviceType.trim() === "" &&
                pkg.durationInDays.trim() === "" &&
                pkg.priceNpr.trim() === "";

            const isComplete =
                pkg.serviceType.trim() !== "" &&
                pkg.durationInDays.trim() !== "" &&
                pkg.priceNpr.trim() !== "";

            if (isCompletelyEmpty || !isComplete) {
                setStatusMessage(
                    "Please complete Services or delete unnecessary service rows."
                );
                setStatusType("error");
                return false;
            }

            const duration = Number(pkg.durationInDays);
            const price = Number(pkg.priceNpr);

            if (Number.isNaN(duration) || duration <= 0) {
                setStatusMessage("Please enter a valid package duration in days.");
                setStatusType("error");
                return false;
            }

            if (Number.isNaN(price) || price <= 0) {
                setStatusMessage("Please enter a valid service price greater than 0.");
                setStatusType("error");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        setStatusMessage("");
        setStatusType("");

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formattedPackages = packages.map((pkg) => ({
                serviceType: pkg.serviceType,
                durationInDays: Number(pkg.durationInDays),
                priceNpr: Number(pkg.priceNpr),
            }));

            await setupDrivingCenterProfile({
                address: address.trim(),
                district: district.trim(),
                municipality: municipality.trim(),
                latitude: Number(latitude),
                longitude: Number(longitude),
                description: description.trim(),
                packages: formattedPackages,
            });

            localStorage.setItem("isProfileComplete", "true");
            setStatusMessage("Profile setup completed successfully.");
            setStatusType("success");

            setTimeout(() => {
                navigate("/driving-center/dashboard");
            }, 1200);
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors)
                    .flat()
                    .join("\n");
                setStatusMessage(messages);
            } else {
                setStatusMessage("Failed to save driving center profile.");
            }
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
                        className={`rounded-md border px-4 py-3 text-sm whitespace-pre-line ${
                            statusType === "success"
                                ? "border-green-500/30 bg-green-500/10 text-green-700"
                                : "border-red-500/30 bg-red-500/10 text-red-700"
                        }`}
                    >
                        {statusMessage}
                    </div>
                )}

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#1E293B]">
                            Location & Contact Details
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                            Add the public location details users will see.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <Input
                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <Input
                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                            placeholder="District"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        />
                        <Input
                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                            placeholder="Municipality"
                            value={municipality}
                            onChange={(e) => setMunicipality(e.target.value)}
                        />
                        <Input
                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                            placeholder="Short description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#1E293B]">
                            Coordinates
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                            Add your exact map coordinates for user discovery.{" "}
                            <a
                                href="https://www.gps-coordinates.net/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#2563EB] underline underline-offset-4 hover:text-[#1D4ED8]"
                            >
                                Click here to find your latitude and longitude
                            </a>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                                placeholder="Latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                            <Input
                                className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                                placeholder="Longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">
                                Pick your location on the map
                            </p>
                            <p className="text-sm text-slate-500">
                                Click anywhere on the map to automatically fill latitude and
                                longitude.
                            </p>
                        </div>

                        <LocationPickerMap
                            latitude={parsedLatitude}
                            longitude={parsedLongitude}
                            onLocationChange={handleMapLocationChange}
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#1E293B]">
                            Services & Pricing
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                            Add the services you offer and set prices in NPR with custom duration in days.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {packages.map((pkg, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                            >
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Service
                                        </label>
                                        <select
                                            value={pkg.serviceType}
                                            onChange={(e) =>
                                                updatePackage(index, "serviceType", e.target.value)
                                            }
                                            className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        >
                                            <option value="" className="text-slate-500">
                                                Select service
                                            </option>
                                            <option value="Car">Car</option>
                                            <option value="Bike">Bike</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Duration (Days)
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                                            placeholder="Enter days"
                                            value={pkg.durationInDays}
                                            onChange={(e) =>
                                                updatePackage(index, "durationInDays", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Price (NPR)
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-12 text-base text-slate-900 placeholder:text-slate-400"
                                            placeholder="Enter price"
                                            value={pkg.priceNpr}
                                            onChange={(e) =>
                                                updatePackage(index, "priceNpr", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-full border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => removeServiceCard(index)}
                                            disabled={packages.length === 1}
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addServiceCard}
                            className="h-11 border-blue-200 bg-blue-50 text-[#1E3A5F] hover:bg-blue-100 hover:text-[#1E3A5F]"
                        >
                            <Plus className="mr-2 size-4" />
                            Add Service
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-12 bg-[#3B82F6] px-6 text-white hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-500"
                    >
                        {isSubmitting ? "Saving..." : "Complete Setup"}
                    </Button>
                </div>
            </div>
        </div>
    );
}