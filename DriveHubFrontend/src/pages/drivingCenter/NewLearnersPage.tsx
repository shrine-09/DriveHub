import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrivingCenterLayout from "@/components/drivingCenter/DrivingCenterLayout";

export default function NewLearnersPage() {
    return (
        <DrivingCenterLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        New Learners
                    </h1>
                    <p className="text-sm text-slate-600">
                        Learners who applied for a service but have not started training yet.
                    </p>
                </div>

                <Card className="border-slate-200/70 bg-white/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">Pending Start</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                        New learner applications will be shown here.
                    </CardContent>
                </Card>
            </div>
        </DrivingCenterLayout>
    );
}