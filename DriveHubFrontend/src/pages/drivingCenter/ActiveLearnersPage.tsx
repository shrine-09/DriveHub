import { useEffect, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { extendLearner, getActiveLearners } from "@/services/auth/authServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function ActiveLearnersPage() {
    const [learners, setLearners] = useState<ActiveLearner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [extraDays, setExtraDays] = useState<Record<number, string>>({});
    const [extendingBookingId, setExtendingBookingId] = useState<number | null>(null);
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

    const handleExtendLearner = async (bookingId: number) => {
        const value = extraDays[bookingId] ?? "";
        const parsedDays = Number(value);

        setStatusMessage("");
        setStatusType("");

        if (!value || Number.isNaN(parsedDays) || parsedDays <= 0) {
            setStatusMessage("Please enter a valid number of extra days.");
            setStatusType("error");
            return;
        }

        setExtendingBookingId(bookingId);

        try {
            const response = await extendLearner(bookingId, parsedDays);

            setLearners((prev) =>
                prev.map((learner) =>
                    learner.bookingId === bookingId
                        ? {
                            ...learner,
                            durationInDays: response.durationInDays,
                            endDate: response.endDate,
                            status: response.status,
                            remainingDays: Math.max(
                                response.durationInDays - learner.completedDays,
                                0
                            ),
                            progressPercentage:
                                response.durationInDays > 0
                                    ? Math.round(
                                        (learner.completedDays / response.durationInDays) * 100
                                    )
                                    : 0,
                        }
                        : learner
                )
            );

            setExtraDays((prev) => ({
                ...prev,
                [bookingId]: "",
            }));

            setStatusMessage(response.message || "Learner extended successfully.");
            setStatusType("success");
        } catch (error: any) {
            setStatusMessage(
                error.response?.data?.message || "Failed to extend learner."
            );
            setStatusType("error");
        } finally {
            setExtendingBookingId(null);
        }
    };
    
    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Active Learners
                    </h1>
                    <p className="text-sm text-slate-600">
                        Learners whose training has already started.
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
                            Loading active learners...
                        </CardContent>
                    </Card>
                ) : learners.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            No active learners at the moment.
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
                                    <th className="px-4 py-3 font-semibold text-slate-700">Completed</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Remaining</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Progress</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Training Period</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Price</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Extend</th>
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
                                            {learner.completedDays} day{learner.completedDays !== 1 ? "s" : ""}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {learner.remainingDays > 0 ? learner.remainingDays : 0} day
                                            {learner.remainingDays !== 1 ? "s" : ""}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="space-y-2">
                                                <p className="text-slate-600">{learner.progressPercentage}%</p>
                                                <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-[#3B82F6]"
                                                        style={{
                                                            width: `${Math.min(learner.progressPercentage, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {new Date(learner.startDate).toLocaleDateString()} <br />
                                            <span className="text-slate-400">to</span> <br />
                                            {new Date(learner.endDate).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            NPR {learner.priceNpr}
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">
                                            {learner.status}
                                        </td>

                                        <td className="px-4 py-4">
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="Extra days"
                                                value={extraDays[learner.bookingId] ?? ""}
                                                onChange={(e) =>
                                                    setExtraDays((prev) => ({
                                                        ...prev,
                                                        [learner.bookingId]: e.target.value,
                                                    }))
                                                }
                                                className="w-28 text-slate-900"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <Button
                                                type="button"
                                                onClick={() => handleExtendLearner(learner.bookingId)}
                                                disabled={extendingBookingId === learner.bookingId}
                                                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-500"
                                            >
                                                {extendingBookingId === learner.bookingId ? "Extending..." : "Extend"}
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