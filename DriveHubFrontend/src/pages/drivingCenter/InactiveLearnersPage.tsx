import { useEffect, useState } from "react";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { getInactiveLearners } from "@/services/auth/authServices";

type InactiveLearner = {
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

export default function InactiveLearnersPage() {
    const [learners, setLearners] = useState<InactiveLearner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const loadLearners = async () => {
            try {
                const data = await getInactiveLearners();
                setLearners(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load inactive learners."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadLearners();
    }, []);

    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Inactive Learners
                    </h1>
                    <p className="text-sm text-slate-600">
                        Learners whose training is completed or no longer active.
                    </p>
                </div>

                {statusMessage && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {statusMessage}
                    </div>
                )}

                {isLoading ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            Loading inactive learners...
                        </CardContent>
                    </Card>
                ) : learners.length === 0 ? (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardContent className="py-10 text-center text-sm text-slate-500">
                            No inactive learners right now.
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