import { useEffect, useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { getMyBookings } from "@/services/auth/authServices";
import { Button } from "@/components/ui/button";

type Booking = {
    bookingId: number;
    serviceType: string;
    durationInDays: number;
    completedDays: number;
    remainingDays: number;
    priceNpr: number;
    startDate: string;
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
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await getMyBookings();
                setBookings(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load booking history."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadBookings();
    }, []);

    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const paginatedBookings = bookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "PendingStart":
                return "bg-amber-100 text-amber-700";
            case "Active":
                return "bg-blue-100 text-blue-700";
            case "Completed":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-8">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Booking History
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                        <p className="max-w-2xl text-sm text-slate-100/90">
                            View your booked driving centers, package details, training dates, and current booking status.
                        </p>
                    </div>
                </div>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading booking history...
                        </CardContent>
                    </Card>
                ) : bookings.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            You have no bookings yet.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200 text-left">
                                        <th className="px-4 py-3 font-semibold text-slate-700">Driving Center</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Service</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Package Days</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Price</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Training Starts</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Completed</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Remaining</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Booked On</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Contact</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {paginatedBookings.map((booking) => (
                                        <tr
                                            key={booking.bookingId}
                                            className="border-b border-slate-100 align-top hover:bg-slate-50/60"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-slate-900">
                                                        {booking.drivingCenter.companyName}
                                                    </p>
                                                    <p className="text-slate-500">
                                                        {[
                                                            booking.drivingCenter.address,
                                                            booking.drivingCenter.municipality,
                                                            booking.drivingCenter.district,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ") || "-"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {booking.serviceType}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {booking.durationInDays} day
                                                {booking.durationInDays > 1 ? "s" : ""}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                NPR {booking.priceNpr}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {new Date(booking.startDate).toLocaleDateString()}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {booking.completedDays} day
                                                {booking.completedDays !== 1 ? "s" : ""}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {booking.remainingDays} day
                                                {booking.remainingDays !== 1 ? "s" : ""}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="space-y-1 text-slate-600">
                                                    <p>{booking.drivingCenter.companyContact}</p>
                                                    <p className="break-all">{booking.drivingCenter.companyEmail}</p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {bookings.length > itemsPerPage && (
                            <div className="flex items-center justify-between border border-slate-200 border-t-0 bg-white px-4 py-3">
                                <p className="text-sm text-slate-500">
                                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                                    {Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length} bookings
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="bg-white text-slate-900 hover:bg-slate-50"
                                    >
                                        Previous
                                    </Button>

                                    <span className="text-sm text-slate-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="bg-white text-slate-900 hover:bg-slate-50"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </UserLayout>
    );
}