import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/services/admin/adminServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AdminUser = {
    userId: number;
    userName: string;
    userEmail: string;
    userRole: string;
};

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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

    const filteredUsers = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return users.filter((user) =>
            user.userName.toLowerCase().includes(search)
        );
    }, [users, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredUsers, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Users</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="overflow-x-auto rounded-md border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="px-4 py-3 text-left font-medium">User ID</th>
                                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {paginatedUsers.map((user) => (
                                                <tr
                                                    key={user.userId}
                                                    className="border-b transition-colors hover:bg-muted/40"
                                                >
                                                    <td className="px-4 py-3">{user.userId}</td>
                                                    <td className="px-4 py-3 font-medium">{user.userName}</td>
                                                    <td className="px-4 py-3 break-all">{user.userEmail}</td>
                                                    <td className="px-4 py-3">{user.userRole}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                }
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}