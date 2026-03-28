import { useEffect, useState } from "react";
import { CalendarDays, Mail, MapPinned, Phone } from "lucide-react";
import UserLayout from "@/components/user/UserLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getMyBookings } from "@/services/auth/authServices";

type UserBooking = {
    bookingId: number;
    serviceType: string;
    durationInDays: number;
    priceNpr: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    drivingCenter: {
        id: number;
        companyName: string;
        companyContact: string;
        companyEmail: string;
        address: string | null;
        district: string | null;
        municipality: string | null;
    };
};

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await getMyBookings();
                setBookings(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load your bookings."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadBookings();
    }, []);

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                            My Bookings
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-slate-100/90 md:text-base">
                            Track the status of your driving center applications and training bookings.
                        </p>
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
                            Loading bookings...
                        </CardContent>
                    </Card>
                ) : bookings.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            You have no bookings yet.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {bookings.map((booking) => (
                            <Card
                                key={booking.bookingId}
                                className="border-slate-200/70 bg-white/95 shadow-sm"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900">
                                        {booking.drivingCenter.companyName}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="font-medium text-slate-900">Service</p>
                                            <p className="text-slate-600">{booking.serviceType}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Duration</p>
                                            <p className="text-slate-600">
                                                {booking.durationInDays} day{booking.durationInDays > 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Price</p>
                                            <p className="text-slate-600">NPR {booking.priceNpr}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Status</p>
                                            <p className="text-slate-600">{booking.status}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">Training Period</p>
                                            <p className="text-slate-600">
                                                {new Date(booking.startDate).toLocaleDateString()} —{" "}
                                                {new Date(booking.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPinned className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">Location</p>
                                            <p className="text-slate-600">
                                                {[
                                                    booking.drivingCenter.address,
                                                    booking.drivingCenter.municipality,
                                                    booking.drivingCenter.district,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") || "Location not available"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <Phone className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">Contact</p>
                                                <p className="text-slate-600">{booking.drivingCenter.companyContact}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 size-4 text-[#3B82F6]" />
                                            <div>
                                                <p className="font-medium text-slate-900">Email</p>
                                                <p className="break-all text-slate-600">
                                                    {booking.drivingCenter.companyEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}