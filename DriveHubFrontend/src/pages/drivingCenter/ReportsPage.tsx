import { useEffect, useMemo, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getActiveLearners,
    getLearnerSessionHistory,
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

type SessionRecord = {
    trainingSessionRecordId: number;
    date: string;
    isPresent: boolean;
    vehicleControlRating: number | null;
    trafficAwarenessRating: number | null;
    confidenceDisciplineRating: number | null;
    remarks: string | null;
};

type LearnerSessionHistory = {
    bookingId: number;
    learner: {
        userId: number;
        userName: string;
        userEmail: string;
    };
    serviceType: string;
    durationInDays: number;
    startDate: string;
    endDate: string;
    records: SessionRecord[];
};

export default function ReportsPage() {
    const [learners, setLearners] = useState<ActiveLearner[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [history, setHistory] = useState<LearnerSessionHistory | null>(null);

    const [isLoadingLearners, setIsLoadingLearners] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadLearners = async () => {
            try {
                const data = await getActiveLearners();
                setLearners(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load active learners."
                );
            } finally {
                setIsLoadingLearners(false);
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

    const loadHistory = async (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setIsLoadingHistory(true);
        setStatusMessage("");

        try {
            const data = await getLearnerSessionHistory(bookingId);
            setHistory(data);
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to load learner session history."
            );
            setHistory(null);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const presentRecords = history?.records.filter((r) => r.isPresent) ?? [];
    const attendanceCount = presentRecords.length;
    const totalSessions = history?.records.length ?? 0;
    const absentCount = totalSessions - attendanceCount;

    const average = (values: (number | null)[]) => {
        const valid = values.filter((v): v is number => v !== null);
        if (valid.length === 0) return null;
        return (valid.reduce((sum, val) => sum + val, 0) / valid.length).toFixed(1);
    };

    const avgVehicleControl = average(
        presentRecords.map((r) => r.vehicleControlRating)
    );
    const avgTrafficAwareness = average(
        presentRecords.map((r) => r.trafficAwarenessRating)
    );
    const avgConfidenceDiscipline = average(
        presentRecords.map((r) => r.confidenceDisciplineRating)
    );

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Reports
                    </h1>
                    <p className="text-sm text-slate-600">
                        Select a learner to view attendance and skill-rating history.
                    </p>
                </div>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Select Learner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search active learner by name..."
                            className="text-slate-900"
                        />

                        {isLoadingLearners ? (
                            <p className="text-sm text-slate-500">Loading learners...</p>
                        ) : filteredLearners.length === 0 ? (
                            <p className="text-sm text-slate-500">No active learners found.</p>
                        ) : (
                            <div className="grid gap-3">
                                {filteredLearners.map((learner) => (
                                    <button
                                        key={learner.bookingId}
                                        type="button"
                                        onClick={() => loadHistory(learner.bookingId)}
                                        className={`rounded-xl border p-4 text-left transition ${
                                            selectedBookingId === learner.bookingId
                                                ? "border-blue-300 bg-blue-50 text-slate-900"
                                                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                                        }`}
                                    >
                                        <p className="font-medium">{learner.user.userName}</p>
                                        <p className="text-sm text-slate-600">
                                            {learner.serviceType} · {learner.durationInDays}
                                        </p>
                                        <p className="text-sm text-slate-500">{learner.user.userEmail}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {isLoadingHistory ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading report...
                        </CardContent>
                    </Card>
                ) : history ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-4">
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-slate-900">Present Days</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-slate-900">
                                    {attendanceCount}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-slate-900">Absent Days</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-slate-900">
                                    {absentCount}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-slate-900">Vehicle Control</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-slate-900">
                                    {avgVehicleControl ?? "-"}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-slate-900">Traffic Awareness</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-slate-900">
                                    {avgTrafficAwareness ?? "-"}
                                </CardContent>
                            </Card>
                        </section>

                        <section className="grid gap-4 md:grid-cols-1">
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-slate-900">
                                        Confidence & Discipline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-slate-900">
                                    {avgConfidenceDiscipline ?? "-"}
                                </CardContent>
                            </Card>
                        </section>

                        <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">
                                    {history.learner.userName} - Session History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.records.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        No session records found for this learner yet.
                                    </p>
                                ) : (
                                    history.records.map((record) => (
                                        <div
                                            key={record.trainingSessionRecordId}
                                            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                                        >
                                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                                <div>
                                                    <p className="text-sm text-slate-500">Date</p>
                                                    <p className="font-medium text-slate-900">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-slate-500">Attendance</p>
                                                    <p className="font-medium text-slate-900">
                                                        {record.isPresent ? "Present" : "Absent"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-slate-500">Vehicle Control</p>
                                                    <p className="font-medium text-slate-900">
                                                        {record.vehicleControlRating ?? "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-slate-500">Traffic Awareness</p>
                                                    <p className="font-medium text-slate-900">
                                                        {record.trafficAwarenessRating ?? "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-slate-500">
                                                        Confidence & Discipline
                                                    </p>
                                                    <p className="font-medium text-slate-900">
                                                        {record.confidenceDisciplineRating ?? "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            {record.remarks && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-slate-500">Remarks</p>
                                                    <p className="text-sm text-slate-700">{record.remarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </>
                ) : null}
            </div>
        </DrivingCenterLayout>
    );
}