import UserLayout from "@/components/user/UserLayout";

export default function UserSearchPage() {
    return (
        <UserLayout>
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">Search Driving Centers</h1>
                <p className="text-muted-foreground">
                    This page will let users search driving centers by name, location, and filters.
                </p>
            </div>
        </UserLayout>
    );
}