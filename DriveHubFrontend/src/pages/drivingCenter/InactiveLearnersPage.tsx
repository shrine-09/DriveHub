import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";

export default function InactiveLearnersPage() {
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

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Inactive Records</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                        Completed and inactive learner records will be shown here.
                    </CardContent>
                </Card>
            </div>
        </DrivingCenterLayout>
    );
}