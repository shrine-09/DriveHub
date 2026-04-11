import { useEffect, useMemo, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import {
    getActiveLearners,
    getLearnerSessionHistory,
} from "@/services/auth/authServices";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { BarChart3, CalendarDays, User2 } from "lucide-react";

type ActiveLearner = {
    bookingId: number;
    serviceType: string;
    durationInDays: number;
    priceNpr: number;
    startDate: string;
    endDate: string;
    status: string;
    completedDays: number;
    remainingDays: number;
    progressPercentage: number;
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
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    useEffect(() => {
        const loadLearners = async () => {
            try {
                const data = await getActiveLearners();
                setLearners(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load learners for reports."
                );
                setStatusType("error");
            } finally {
                setIsLoadingLearners(false);
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

    const handleSelectLearner = async (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setHistory(null);
        setStatusMessage("");
        setStatusType("");
        setIsLoadingHistory(true);
        setIsReportDialogOpen(true);

        try {
            const data = await getLearnerSessionHistory(bookingId);
            setHistory(data);
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to load learner report."
            );
            setStatusType("error");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const chartData = useMemo(() => {
        if (!history) return [];

        return [...history.records]
            .filter((record) => record.isPresent)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((record) => ({
                date: new Date(record.date).toLocaleDateString(),
                vehicleControl: record.vehicleControlRating ?? 0,
                trafficAwareness: record.trafficAwarenessRating ?? 0,
                confidenceDiscipline: record.confidenceDisciplineRating ?? 0,
            }));
    }, [history]);

    const reportSummary = useMemo(() => {
        if (!history) return null;

        const presentRecords = history.records.filter((record) => record.isPresent);
        const absentRecords = history.records.filter((record) => !record.isPresent);

        const avg = (values: number[]) =>
            values.length > 0
                ? Number(
                    (
                        values.reduce((sum, value) => sum + value, 0) / values.length
                    ).toFixed(2)
                )
                : 0;

        return {
            totalSessions: history.records.length,
            presentCount: presentRecords.length,
            absentCount: absentRecords.length,
            averageVehicleControl: avg(
                presentRecords
                    .map((record) => record.vehicleControlRating)
                    .filter((value): value is number => value !== null)
            ),
            averageTrafficAwareness: avg(
                presentRecords
                    .map((record) => record.trafficAwarenessRating)
                    .filter((value): value is number => value !== null)
            ),
            averageConfidenceDiscipline: avg(
                presentRecords
                    .map((record) => record.confidenceDisciplineRating)
                    .filter((value): value is number => value !== null)
            ),
        };
    }, [history]);

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-[#1E3A5F] via-[#334155] to-[#3B82F6] p-6 text-white shadow-sm md:p-8">
                    <div className="space-y-3">
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                            Learner Reports
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                        <p className="max-w-2xl text-sm text-slate-100/90">
                            Search a learner, open their report, and review attendance and
                            performance trends.
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

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Find Learner</CardTitle>
                        <CardDescription className="text-slate-600">
                            Search active learners and open an individual performance report.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search learner by name..."
                            className="text-slate-900"
                        />

                        {isLoadingLearners ? (
                            <p className="text-sm text-slate-500">Loading learners...</p>
                        ) : filteredLearners.length === 0 ? (
                            <p className="text-sm text-slate-500">No learners found.</p>
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
                                                <th className="px-4 py-3 font-semibold text-slate-700">Progress</th>
                                                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {paginatedLearners.map((learner) => (
                                                <tr
                                                    key={learner.bookingId}
                                                    className="border-b border-slate-100 hover:bg-slate-50/70"
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
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <p className="text-slate-600">
                                                                {learner.progressPercentage}%
                                                            </p>
                                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                                                                <div
                                                                    className="h-full rounded-full bg-[#3B82F6]"
                                                                    style={{
                                                                        width: `${Math.min(
                                                                            learner.progressPercentage,
                                                                            100
                                                                        )}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleSelectLearner(learner.bookingId)}
                                                            className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                                                        >
                                                            View Report
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {filteredLearners.length > itemsPerPage && (
                                    <div className="flex items-center justify-between pt-4">
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

                <Dialog
                    open={isReportDialogOpen && !!selectedLearner}
                    onOpenChange={(open) => {
                        setIsReportDialogOpen(open);
                        if (!open) {
                            setSelectedBookingId(null);
                            setHistory(null);
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedLearner
                                    ? `Report - ${selectedLearner.user.userName}`
                                    : "Learner Report"}
                            </DialogTitle>
                            <DialogDescription>
                                Attendance summary, performance trend, and session history.
                            </DialogDescription>
                        </DialogHeader>

                        {isLoadingHistory ? (
                            <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                <CardContent className="py-10 text-center text-sm text-slate-500">
                                    Loading learner report...
                                </CardContent>
                            </Card>
                        ) : history && reportSummary && selectedLearner ? (
                            <div className="space-y-6">
                                <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <User2 className="size-4" />
                                                <span className="text-sm">Selected Learner Report</span>
                                            </div>
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
                                                    Package
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-900">
                                                    {selectedLearner.durationInDays} day
                                                    {selectedLearner.durationInDays > 1 ? "s" : ""}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Progress
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-900">
                                                    {selectedLearner.progressPercentage}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-slate-500">Total Sessions</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {reportSummary.totalSessions}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-slate-500">Present</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {reportSummary.presentCount}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-slate-500">Absent</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {reportSummary.absentCount}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-slate-500">Avg Vehicle Control</p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {reportSummary.averageVehicleControl}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-slate-500">
                                                Avg Traffic Awareness
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {reportSummary.averageTrafficAwareness}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="size-5 text-[#3B82F6]" />
                                            <div>
                                                <CardTitle className="text-slate-900">
                                                    Performance Rating Trend
                                                </CardTitle>
                                                <CardDescription className="text-slate-600">
                                                    Session-by-session rating movement over time.
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData.length === 0 ? (
                                            <p className="text-sm text-slate-500">
                                                No present-session rating data available yet.
                                            </p>
                                        ) : (
                                            <div className="h-[380px] w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis domain={[0, 10]} />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="vehicleControl"
                                                            name="Vehicle Control"
                                                            stroke="#2563EB"
                                                            strokeWidth={3}
                                                            dot={{ r: 4 }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="trafficAwareness"
                                                            name="Traffic Awareness"
                                                            stroke="#16A34A"
                                                            strokeWidth={3}
                                                            dot={{ r: 4 }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="confidenceDiscipline"
                                                            name="Confidence & Discipline"
                                                            stroke="#DC2626"
                                                            strokeWidth={3}
                                                            dot={{ r: 4 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="size-5 text-[#3B82F6]" />
                                            <div>
                                                <CardTitle className="text-slate-900">
                                                    Session History
                                                </CardTitle>
                                                <CardDescription className="text-slate-600">
                                                    Detailed attendance and rating records for this learner.
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {history.records.length === 0 ? (
                                            <p className="text-sm text-slate-500">
                                                No session history available yet.
                                            </p>
                                        ) : (
                                            <div className="overflow-hidden rounded-2xl border border-slate-200">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-slate-50">
                                                        <tr className="border-b border-slate-200 text-left">
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Attendance</th>
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Vehicle Control</th>
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Traffic Awareness</th>
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Confidence & Discipline</th>
                                                            <th className="px-4 py-3 font-semibold text-slate-700">Remarks</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {history.records.map((record) => (
                                                            <tr
                                                                key={record.trainingSessionRecordId}
                                                                className="border-b border-slate-100 hover:bg-slate-50/60"
                                                            >
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {new Date(record.date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {record.isPresent ? "Present" : "Absent"}
                                                                </td>
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {record.vehicleControlRating ?? "-"}
                                                                </td>
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {record.trafficAwarenessRating ?? "-"}
                                                                </td>
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {record.confidenceDisciplineRating ?? "-"}
                                                                </td>
                                                                <td className="px-4 py-4 text-slate-600">
                                                                    {record.remarks || "-"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </DrivingCenterLayout>
    );
}