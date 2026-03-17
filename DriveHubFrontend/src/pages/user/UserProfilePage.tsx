import { Link } from "react-router-dom";
import UserLayout from "@/components/user/UserLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserProfilePage() {
    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "No email available";

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account information and settings from here.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{email}</p>
                        </div>

                        <div className="pt-2">
                            <Button asChild>
                                <Link to="/change-password">Change Password</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}