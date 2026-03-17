import UserLayout from "@/components/user/UserLayout";

export default function UserMapPage() {
    return (
        <UserLayout>
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">Map Search</h1>
                <p className="text-muted-foreground">
                    This page will let users explore driving centers using a map-based view.
                </p>
            </div>
        </UserLayout>
    );
}