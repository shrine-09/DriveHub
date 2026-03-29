import { useEffect, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPendingLearners, startTraining } from "@/services/auth/authServices";

type PendingLearner = {
    bookingId: number;
    serviceType: string;
    durationInDays: number;
    priceNpr: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    user: {
        userId: number;
        userName: string;
        userEmail: string;
    };
};

export default function NewLearnersPage() {
    const [learners, setLearners] = useState<PendingLearner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");
    const [startingBookingId, setStartingBookingId] = useState<number | null>(null);

    useEffect(() => {
        const loadLearners = async () => {
            try {
                const data = await getPendingLearners();
                setLearners(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load pending learners."
                );
                setStatusType("error");
            } finally {
                setIsLoading(false);
            }
        };

        loadLearners();
    }, []);

    const handleStartTraining = async (bookingId: number) => {
        setStatusMessage("");
        setStatusType("");
        setStartingBookingId(bookingId);

        try {
            const response = await startTraining(bookingId);

            setLearners((prev) => prev.filter((learner) => learner.bookingId !== bookingId));
            setStatusMessage(response.message || "Training started successfully.");
            setStatusType("success");
        } catch (error: any) {
            if (error.response?.data?.message) {
                setStatusMessage(error.response.data.message);
            } else {
                setStatusMessage("Failed to start training.");
            }
            setStatusType("error");
        } finally {
            setStartingBookingId(null);
        }
    };

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        New Learners
                    </h1>
                    <p className="text-sm text-slate-600">
                        Learners who have booked but have not started training yet.
                    </p>
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

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading pending learners...
                        </CardContent>
                    </Card>
                ) : learners.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            No pending learners right now.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-4 py-3 font-semibold text-slate-700">Learner</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Service</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Duration</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Price</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Requested On</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Training Period</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
                                </tr>
                                </thead>

                                <tbody>
                                {learners.map((learner) => (
                                    <tr
                                        key={learner.bookingId}
                                        className="border-b border-slate-100 align-top hover:bg-slate-50/60"
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
                                            {learner.durationInDays} day{learner.durationInDays > 1 ? "s" : ""}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            NPR {learner.priceNpr}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {new Date(learner.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {new Date(learner.startDate).toLocaleDateString()} <br />
                                            <span className="text-slate-400">to</span> <br />
                                            {new Date(learner.endDate).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {learner.status}
                                        </td>

                                        <td className="px-4 py-4">
                                            <Button
                                                type="button"
                                                onClick={() => handleStartTraining(learner.bookingId)}
                                                disabled={startingBookingId === learner.bookingId}
                                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-500"
                                            >
                                                {startingBookingId === learner.bookingId
                                                    ? "Starting..."
                                                    : "Start Training"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DrivingCenterLayout>
    );
}