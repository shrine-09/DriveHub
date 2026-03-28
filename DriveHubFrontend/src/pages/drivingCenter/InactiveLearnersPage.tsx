import { useEffect, useState } from "react";
import { CalendarDays, Mail, User2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";
import { getInactiveLearners } from "@/services/auth/authServices";

type InactiveLearner = {
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
                        Learners whose training has been completed or cancelled.
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
                            No inactive learners at the moment.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {learners.map((learner) => (
                            <Card
                                key={learner.bookingId}
                                className="border-slate-200/70 bg-white/95 shadow-sm"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900">
                                        {learner.user.userName}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <User2 className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">Learner</p>
                                            <p className="text-slate-600">{learner.user.userName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">Email</p>
                                            <p className="break-all text-slate-600">
                                                {learner.user.userEmail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="font-medium text-slate-900">Service</p>
                                            <p className="text-slate-600">{learner.serviceType}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Duration</p>
                                            <p className="text-slate-600">{learner.durationInDays}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Price</p>
                                            <p className="text-slate-600">NPR {learner.priceNpr}</p>
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">Status</p>
                                            <p className="text-slate-600">{learner.status}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="mt-0.5 size-4 text-[#3B82F6]" />
                                        <div>
                                            <p className="font-medium text-slate-900">Training Period</p>
                                            <p className="text-slate-600">
                                                {new Date(learner.startDate).toLocaleDateString()} —{" "}
                                                {new Date(learner.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DrivingCenterLayout>
    );
}