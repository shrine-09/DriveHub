import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/services/admin/adminServices";
import { Input } from "@/components/ui/input";

type AdminUser = {
    userId: number;
    userName: string;
    userEmail: string;
    userRole: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error: any) {
                setStatusMessage(
                    error.response?.data?.message || "Failed to load users."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        return user.userName.toLowerCase().includes(search);
    });
    
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
                            <p className="text-sm text-muted-foreground">
                                View all registered normal users in the system.
                            </p>
                        </div>

                        <div className="max-w-md">
                            <Input
                                placeholder="Search by user name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {statusMessage && (
                            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                                {statusMessage}
                            </div>
                        )}

                        {isLoading ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    Loading users...
                                </CardContent>
                            </Card>
                        ) : filteredUsers.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                    No registered users found.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {filteredUsers.map((user) => (
                                    <Card
                                        key={user.userId}
                                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg">{user.userName}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Email</p>
                                                <p className="font-medium break-all">{user.userEmail}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">Role</p>
                                                <p className="font-medium">{user.userRole}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">User ID</p>
                                                <p className="font-medium">{user.userId}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}