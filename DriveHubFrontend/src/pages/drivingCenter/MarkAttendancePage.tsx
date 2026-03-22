import { useMemo, useState } from "react";
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

export default function MarkAttendancePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLearnerName, setSelectedLearnerName] = useState("");
    const [isPresent, setIsPresent] = useState<boolean | null>(null);

    const [vehicleControl, setVehicleControl] = useState(5);
    const [trafficAwareness, setTrafficAwareness] = useState(5);
    const [confidenceDiscipline, setConfidenceDiscipline] = useState(5);
    const [remarks, setRemarks] = useState("");

    const canSubmit = useMemo(() => {
        if (!selectedLearnerName || isPresent === null) return false;
        if (isPresent === false) return true;

        return (
            vehicleControl >= 1 &&
            trafficAwareness >= 1 &&
            confidenceDiscipline >= 1
        );
    }, [
        selectedLearnerName,
        isPresent,
        vehicleControl,
        trafficAwareness,
        confidenceDiscipline,
    ]);

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

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Select Learner</CardTitle>
                        <CardDescription className="text-slate-600">
                            Active learner search will be connected here next.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search active learner by name..."
                            className="text-slate-900"
                        />

                        <Input
                            value={selectedLearnerName}
                            onChange={(e) => setSelectedLearnerName(e.target.value)}
                            placeholder="Selected learner name..."
                            className="text-slate-900"
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Attendance</CardTitle>
                        <CardDescription className="text-slate-600">
                            Mark whether the learner attended today’s session.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                        <Button
                            type="button"
                            variant={isPresent === true ? "default" : "outline"}
                            className={isPresent === true ? "bg-[#3B82F6] text-white hover:bg-[#2563EB]" : ""}
                            onClick={() => setIsPresent(true)}
                        >
                            Present
                        </Button>

                        <Button
                            type="button"
                            variant={isPresent === false ? "default" : "outline"}
                            className={isPresent === false ? "bg-red-600 text-white hover:bg-red-700" : ""}
                            onClick={() => setIsPresent(false)}
                        >
                            Absent
                        </Button>
                    </CardContent>
                </Card>

                {isPresent === true && (
                    <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900">Daily Skill Ratings</CardTitle>
                            <CardDescription className="text-slate-600">
                                Rate the learner on three skill areas from 1 to 10.
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
            />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        disabled={!canSubmit}
                        className="bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:opacity-50"
                    >
                        Complete Rating for Today
                    </Button>
                </div>
            </div>
        </DrivingCenterLayout>
    );
}