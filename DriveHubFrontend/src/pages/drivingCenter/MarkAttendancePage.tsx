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

    const filteredLearners = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return learners.filter((learner) =>
            learner.user.userName.toLowerCase().includes(search)
        );
    }, [learners, searchTerm]);

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

            setStatusMessage(response.message || "Training session recorded successfully.");
            setStatusType("success");
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
            setIsSubmitting(false);
        }
    };

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Mark Attendance
                    </h1>
                    <p className="text-sm text-slate-600">
                        Search an active learner, mark attendance, and complete today’s skill rating.
                    </p>
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
                        <CardTitle className="text-slate-900">Select Learner</CardTitle>
                        <CardDescription className="text-slate-600">
                            Search and choose an active learner.
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
                            <div className="grid gap-3">
                                {filteredLearners.map((learner) => (
                                    <button
                                        key={learner.bookingId}
                                        type="button"
                                        onClick={() => handleSelectLearner(learner.bookingId)}
                                        className={`rounded-xl border p-4 text-left transition ${
                                            selectedBookingId === learner.bookingId
                                                ? "border-blue-300 bg-blue-50 text-slate-900"
                                                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                                        }`}
                                    >
                                        <p className="font-medium text-slate-900">
                                            {learner.user.userName}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {learner.serviceType} · {learner.durationInDays}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {learner.user.userEmail}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {selectedLearner && (
                    <>
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
                                    disabled={!hasTrainingStarted}
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
                                    disabled={!hasTrainingStarted}
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
                    disabled={!hasTrainingStarted}
                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit || isSubmitting}
                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-500"
                            >
                                {isSubmitting ? "Saving..." : "Complete Rating for Today"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </DrivingCenterLayout>
    );
}