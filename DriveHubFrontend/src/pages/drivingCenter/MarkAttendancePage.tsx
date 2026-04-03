import { useEffect, useMemo, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getActiveLearners,
    recordTrainingSession,
} from "@/services/auth/authServices";

type ActiveLearner = {
    bookingId: number;
    serviceType: string;
    durationInDays: number;
    priceNpr: number;
    startDate: string;
    endDate: string;
    status: string;
    user: {
        userId: number;
        userName: string;
        userEmail: string;
    };
};

type AttendanceRowStatus = "present" | "absent";

export default function MarkAttendancePage() {
    const [learners, setLearners] = useState<ActiveLearner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [isPresent, setIsPresent] = useState<boolean | null>(null);

    const [vehicleControl, setVehicleControl] = useState(5);
    const [trafficAwareness, setTrafficAwareness] = useState(5);
    const [confidenceDiscipline, setConfidenceDiscipline] = useState(5);
    const [remarks, setRemarks] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [attendanceStatusMap, setAttendanceStatusMap] = useState<
        Record<number, AttendanceRowStatus>
    >({});

    useEffect(() => {
        const loadLearners = async () => {
            try {
                const data = await getActiveLearners();
                setLearners(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load active learners."
                );
                setStatusType("error");
            } finally {
                setIsLoading(false);
            }
        };

        loadLearners();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredLearners = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return learners.filter((learner) =>
            learner.user.userName.toLowerCase().includes(search)
        );
    }, [learners, searchTerm]);

    const totalPages = Math.ceil(filteredLearners.length / itemsPerPage);

    const paginatedLearners = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLearners.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLearners, currentPage]);

    const selectedLearner = useMemo(() => {
        return learners.find((learner) => learner.bookingId === selectedBookingId) || null;
    }, [learners, selectedBookingId]);

    const todayDateOnly = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    const selectedLearnerStartDate = useMemo(() => {
        if (!selectedLearner) return null;
        const start = new Date(selectedLearner.startDate);
        return new Date(start.getFullYear(), start.getMonth(), start.getDate());
    }, [selectedLearner]);

    const hasTrainingStarted = useMemo(() => {
        if (!selectedLearnerStartDate) return false;
        return todayDateOnly >= selectedLearnerStartDate;
    }, [todayDateOnly, selectedLearnerStartDate]);

    const canSubmit = useMemo(() => {
        if (!selectedBookingId || isPresent === null) return false;
        if (!hasTrainingStarted) return false;
        if (isPresent === false) return true;

        return (
            vehicleControl >= 1 &&
            trafficAwareness >= 1 &&
            confidenceDiscipline >= 1
        );
    }, [
        selectedBookingId,
        isPresent,
        hasTrainingStarted,
        vehicleControl,
        trafficAwareness,
        confidenceDiscipline,
    ]);

    const handleSelectLearner = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setIsPresent(null);
        setVehicleControl(5);
        setTrafficAwareness(5);
        setConfidenceDiscipline(5);
        setRemarks("");
        setStatusMessage("");
        setStatusType("");
    };

    const handleSubmit = async () => {
        if (!selectedBookingId || isPresent === null || !hasTrainingStarted) return;

        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const today = new Date().toISOString().split("T")[0];

            const response = await recordTrainingSession({
                bookingId: selectedBookingId,
                date: today,
                isPresent,
                vehicleControlRating: isPresent ? vehicleControl : null,
                trafficAwarenessRating: isPresent ? trafficAwareness : null,
                confidenceDisciplineRating: isPresent ? confidenceDiscipline : null,
                remarks,
            });

            setAttendanceStatusMap((prev) => ({
                ...prev,
                [selectedBookingId]: isPresent ? "present" : "absent",
            }));

            setStatusMessage(
                response.message || "Training session recorded successfully."
            );
            setStatusType("success");

            setTimeout(() => {
                setSelectedBookingId(null);
                setIsPresent(null);
                setVehicleControl(5);
                setTrafficAwareness(5);
                setConfidenceDiscipline(5);
                setRemarks("");
            }, 700);
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat().join("\n");
                setStatusMessage(messages);
            } else {
                setStatusMessage("Failed to record training session.");
            }
            setStatusType("error");
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 500);
        }
    };

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-8">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Attendance Management
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Mark Attendance
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-100/90">
                            Search an active learner, record attendance, and complete daily skill ratings.
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
                        <CardTitle className="text-slate-900">Find Learner</CardTitle>
                        <CardDescription className="text-slate-600">
                            Search and choose an active learner to record today’s attendance.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search active learner by name..."
                            className="text-slate-900"
                        />

                        {isLoading ? (
                            <p className="text-sm text-slate-500">Loading active learners...</p>
                        ) : filteredLearners.length === 0 ? (
                            <p className="text-sm text-slate-500">No active learners found.</p>
                        ) : (
                            <>
                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-slate-50">
                                            <tr className="border-b border-slate-200 text-left">
                                                <th className="px-4 py-3 font-semibold text-slate-700">Learner</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Service</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Duration</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Training Starts</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {paginatedLearners.map((learner) => {
                                                const rowStatus = attendanceStatusMap[learner.bookingId];

                                                return (
                                                    <tr
                                                        key={learner.bookingId}
                                                        className={`border-b border-slate-100 transition ${
                                                            selectedBookingId === learner.bookingId
                                                                ? "bg-blue-50/70"
                                                                : rowStatus === "present"
                                                                    ? "bg-green-50/80"
                                                                    : rowStatus === "absent"
                                                                        ? "bg-red-50/80"
                                                                        : "hover:bg-slate-50/60"
                                                        }`}
                                                    >
                                                        <td className="px-4 py-4 font-medium text-slate-900">
                                                            {learner.user.userName}
                                                        </td>

                                                        <td className="px-4 py-4 text-slate-600">
                                                            {learner.user.userEmail}
                                                        </td>

                                                        <td className="px-4 py-4 text-slate-600">
                                                            {learner.serviceType}
                                                        </td>

                                                        <td className="px-4 py-4 text-slate-600">
                                                            {learner.durationInDays} day
                                                            {learner.durationInDays > 1 ? "s" : ""}
                                                        </td>

                                                        <td className="px-4 py-4 text-slate-600">
                                                            {new Date(learner.startDate).toLocaleDateString()}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            {rowStatus === "present" ? (
                                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                  Marked Present
                                </span>
                                                            ) : rowStatus === "absent" ? (
                                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                  Marked Absent
                                </span>
                                                            ) : (
                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                  Not Marked
                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleSelectLearner(learner.bookingId)}
                                                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                                            >
                                                                {rowStatus ? "Update Attendance" : "Mark Attendance"}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {filteredLearners.length > itemsPerPage && (
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-sm text-slate-500">
                                            Showing {(currentPage - 1) * itemsPerPage + 1}–
                                            {Math.min(currentPage * itemsPerPage, filteredLearners.length)} of{" "}
                                            {filteredLearners.length} learners
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
                                                onClick={() =>
                                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                }
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
                    </CardContent>
                </Card>

                {selectedLearner && (
                    <>
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-500">Selected Learner</p>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {selectedLearner.user.userName}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        {selectedLearner.user.userEmail}
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Service
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900">
                                            {selectedLearner.serviceType}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Duration
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900">
                                            {selectedLearner.durationInDays} day
                                            {selectedLearner.durationInDays > 1 ? "s" : ""}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Price
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900">
                                            NPR {selectedLearner.priceNpr}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Training Schedule</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Current training period for {selectedLearner.user.userName}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="text-slate-700">
                                    <span className="font-medium text-slate-900">Training starts:</span>{" "}
                                    {new Date(selectedLearner.startDate).toLocaleDateString()}
                                </p>
                                <p className="text-slate-700">
                                    <span className="font-medium text-slate-900">Training ends:</span>{" "}
                                    {new Date(selectedLearner.endDate).toLocaleDateString()}
                                </p>

                                {!hasTrainingStarted && (
                                    <div className="rounded-md border border-amber-300/50 bg-amber-50 px-4 py-3 text-amber-800">
                                        Training has not started yet. Attendance can only be recorded from{" "}
                                        {new Date(selectedLearner.startDate).toLocaleDateString()}.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Attendance</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Mark whether {selectedLearner.user.userName} attended today’s session.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-3">
                                <Button
                                    type="button"
                                    variant={isPresent === true ? "default" : "outline"}
                                    className={
                                        isPresent === true
                                            ? "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                    onClick={() => setIsPresent(true)}
                                    disabled={!hasTrainingStarted || isSubmitting}
                                >
                                    Present
                                </Button>

                                <Button
                                    type="button"
                                    variant={isPresent === false ? "default" : "outline"}
                                    className={
                                        isPresent === false
                                            ? "bg-red-600 text-white hover:bg-red-700"
                                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                    onClick={() => setIsPresent(false)}
                                    disabled={!hasTrainingStarted || isSubmitting}
                                >
                                    Absent
                                </Button>
                            </CardContent>
                        </Card>

                        {isPresent === true && hasTrainingStarted && (
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Daily Skill Ratings</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Rate today’s performance from 1 to 10.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">
                                                Vehicle Control
                                            </label>
                                            <span className="text-sm font-semibold text-[#2563EB]">
                                                {vehicleControl}/10
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            value={vehicleControl}
                                            onChange={(e) => setVehicleControl(Number(e.target.value))}
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">
                                                Traffic Awareness
                                            </label>
                                            <span className="text-sm font-semibold text-[#2563EB]">
                                                {trafficAwareness}/10
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            value={trafficAwareness}
                                            onChange={(e) => setTrafficAwareness(Number(e.target.value))}
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">
                                                Confidence & Discipline
                                            </label>
                                            <span className="text-sm font-semibold text-[#2563EB]">
                                                {confidenceDiscipline}/10
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            value={confidenceDiscipline}
                                            onChange={(e) => setConfidenceDiscipline(Number(e.target.value))}
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Remarks</CardTitle>
                                <CardDescription className="text-slate-600">
                                    Optional notes for today’s session.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks for today's session..."
                    className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    disabled={!hasTrainingStarted || isSubmitting}
                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSelectedBookingId(null);
                                    setIsPresent(null);
                                    setVehicleControl(5);
                                    setTrafficAwareness(5);
                                    setConfidenceDiscipline(5);
                                    setRemarks("");
                                    setStatusMessage("");
                                    setStatusType("");
                                }}
                                disabled={isSubmitting}
                                className="border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit || isSubmitting}
                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-500"
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