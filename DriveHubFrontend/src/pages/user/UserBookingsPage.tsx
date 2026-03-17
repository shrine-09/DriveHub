import UserLayout from "@/components/user/UserLayout";

export default function UserBookingsPage() {
    return (
        <UserLayout>
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-muted-foreground">
                    This page will show the user’s booking requests, upcoming visits, and
                    training-related schedules.
                </p>
            </div>
        </UserLayout>
    );
}