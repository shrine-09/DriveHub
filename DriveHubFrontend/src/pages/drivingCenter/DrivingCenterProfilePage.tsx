import { useEffect, useState } from "react";
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
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import LocationPickerMap from "@/components/drivingCenter/LocationPickerMap";
import {
    getDrivingCenterProfile,
    setupDrivingCenterProfile,
} from "@/services/auth/authServices";

type PackageItem = {
    serviceType: string;
    durationType: string;
    priceNpr: string;
};

type DrivingCenterProfile = {
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
    isProfileComplete: boolean;
    packages: {
        id: number;
        serviceType: string;
        durationType: string;
        priceNpr: number;
    }[];
};

export default function DrivingCenterProfilePage() {
    const [profile, setProfile] = useState<DrivingCenterProfile | null>(null);

    const [address, setAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [packages, setPackages] = useState<PackageItem[]>([
        { serviceType: "", durationType: "", priceNpr: "" },
    ]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const parsedLatitude = latitude ? Number(latitude) : null;
    const parsedLongitude = longitude ? Number(longitude) : null;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getDrivingCenterProfile();
                setProfile(data);

                setAddress(data.address ?? "");
                setDistrict(data.district ?? "");
                setMunicipality(data.municipality ?? "");
                setLatitude(data.latitude !== null ? String(data.latitude) : "");
                setLongitude(data.longitude !== null ? String(data.longitude) : "");
                setDescription(data.description ?? "");

                if (data.packages && data.packages.length > 0) {
                    setPackages(
                        data.packages.map((pkg: any) => ({
                            serviceType: pkg.serviceType,
                            durationType: pkg.durationType,
                            priceNpr: String(pkg.priceNpr),
                        }))
                    );
                }
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load driving center profile."
                );
                setStatusType("error");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

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
            { serviceType: "", durationType: "", priceNpr: "" },
        ]);
    };

    const removeServiceCard = (index: number) => {
        setPackages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!address.trim()) {
            setStatusMessage("Address is required.");
            setStatusType("error");
            return false;
        }

        if (!district.trim()) {
            setStatusMessage("District is required.");
            setStatusType("error");
            return false;
        }

        if (!municipality.trim()) {
            setStatusMessage("Municipality is required.");
            setStatusType("error");
            return false;
        }

        if (!latitude.trim() || !longitude.trim()) {
            setStatusMessage("Latitude and longitude are required.");
            setStatusType("error");
            return false;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            setStatusMessage("Latitude must be a valid number between -90 and 90.");
            setStatusType("error");
            return false;
        }

        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            setStatusMessage("Longitude must be a valid number between -180 and 180.");
            setStatusType("error");
            return false;
        }

        const validPackages = packages.filter(
            (pkg) =>
                pkg.serviceType.trim() !== "" &&
                pkg.durationType.trim() !== "" &&
                pkg.priceNpr.trim() !== ""
        );

        if (validPackages.length === 0) {
            setStatusMessage("At least one service package is required.");
            setStatusType("error");
            return false;
        }

        for (const pkg of packages) {
            const hasAnyValue =
                pkg.serviceType.trim() !== "" ||
                pkg.durationType.trim() !== "" ||
                pkg.priceNpr.trim() !== "";

            const isComplete =
                pkg.serviceType.trim() !== "" &&
                pkg.durationType.trim() !== "" &&
                pkg.priceNpr.trim() !== "";

            if (hasAnyValue && !isComplete) {
                setStatusMessage(
                    "Each service row must have service type, duration, and price."
                );
                setStatusType("error");
                return false;
            }

            if (isComplete) {
                const price = Number(pkg.priceNpr);

                if (Number.isNaN(price) || price <= 0) {
                    setStatusMessage("Each service price must be greater than 0.");
                    setStatusType("error");
                    return false;
                }
            }
        }

        return true;
    };

    const handleSave = async () => {
        setStatusMessage("");
        setStatusType("");

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const filteredPackages = packages
                .filter(
                    (pkg) =>
                        pkg.serviceType.trim() !== "" &&
                        pkg.durationType.trim() !== "" &&
                        pkg.priceNpr.trim() !== ""
                )
                .map((pkg) => ({
                    serviceType: pkg.serviceType,
                    durationType: pkg.durationType,
                    priceNpr: Number(pkg.priceNpr),
                }));

            const response = await setupDrivingCenterProfile({
                address: address.trim(),
                district: district.trim(),
                municipality: municipality.trim(),
                latitude: Number(latitude),
                longitude: Number(longitude),
                description: description.trim(),
                packages: filteredPackages,
            });

            localStorage.setItem("isProfileComplete", "true");
            setStatusMessage(response.message || "Profile updated successfully.");
            setStatusType("success");
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors)
                    .flat()
                    .join("\n");
                setStatusMessage(messages);
            } else {
                setStatusMessage("Failed to update profile.");
            }
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-8">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Profile Management
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isLoading ? "Loading profile..." : profile?.companyName || "Driving Center Profile"}
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-100/90">
                            Update your public center details, map location, services, and pricing.
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

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading profile...
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Center Information</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Basic account-linked information for your center.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-5 md:grid-cols-2">
                                <Input
                                    value={profile?.companyName ?? ""}
                                    disabled
                                    className="h-12 text-base text-slate-900"
                                />
                                <Input
                                    value={profile?.companyEmail ?? ""}
                                    disabled
                                    className="h-12 text-base text-slate-900"
                                />
                                <Input
                                    value={profile?.companyContact ?? ""}
                                    disabled
                                    className="h-12 text-base text-slate-900"
                                />
                                <Input
                                    value={profile?.companyType ?? ""}
                                    disabled
                                    className="h-12 text-base text-slate-900"
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Location & Details</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Update the public details users will see.
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
                                <CardTitle className="text-slate-900">Coordinates</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Update your exact map location.{" "}
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
                                        Click anywhere on the map to automatically fill latitude and longitude.
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
                                <CardTitle className="text-slate-900">Services & Pricing</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Update the services you offer and their prices in NPR.
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
                                                    Duration
                                                </label>
                                                <select
                                                    value={pkg.durationType}
                                                    onChange={(e) =>
                                                        updatePackage(index, "durationType", e.target.value)
                                                    }
                                                    className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                                >
                                                    <option value="" className="text-slate-500">
                                                        Select duration
                                                    </option>
                                                    <option value="2Weeks">2 Weeks</option>
                                                    <option value="1Month">1 Month</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                                    Price (NPR)
                                                </label>
                                                <Input
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
                                                    className="h-12 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
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
                                    className="h-11 border-blue-200 bg-blue-50 text-[#1E3A5F] hover:bg-blue-100"
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add Service
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="h-12 bg-[#3B82F6] px-6 text-white hover:bg-[#2563EB]"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </DrivingCenterLayout>
    );
}