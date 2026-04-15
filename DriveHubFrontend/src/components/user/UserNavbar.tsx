import { Link, useNavigate } from "react-router-dom";
import {
    Bell,
    CalendarDays,
    LogOut,
    MapPinned,
    Search,
    User2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    getMyNotifications,
    markNotificationAsRead,
} from "@/services/auth/authServices";

type NotificationItem = {
    id: number;
    title: string;
    message: string;
    type: string;
    relatedBookingId: number | null;
    isRead: boolean;
    createdAt: string;
};

export default function UserNavbar() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "User";
    const role = localStorage.getItem("role");

    const isDrivingCenter = role === "DrivingCenter";

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

    useEffect(() => {
        if (isDrivingCenter) return;

        const loadNotifications = async () => {
            try {
                setIsNotificationsLoading(true);
                const data = await getMyNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to load notifications.", error);
            } finally {
                setIsNotificationsLoading(false);
            }
        };

        loadNotifications();
    }, [isDrivingCenter]);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.isRead).length,
        [notifications]
    );

    const recentNotifications = useMemo(
        () => notifications.slice(0, 5),
        [notifications]
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mustChangePassword");
        localStorage.removeItem("isProfileComplete");
        navigate("/login");
    };

    const handleNotificationClick = async (notificationId: number) => {
        try {
            await markNotificationAsRead(notificationId);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read.", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-[#F8F7F4]/85 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
                <Link
                    to={isDrivingCenter ? "/driving-center/dashboard" : "/user/dashboard"}
                    className="flex items-center gap-2 font-semibold text-[#1E293B] transition-opacity hover:opacity-80"
                >
                    <span className="font-semibold">DriveHub</span>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="ghost"
                        asChild
                        className="text-[#334155] hover:bg-blue-50 hover:text-[#2563EB]"
                    >
                        <Link to={isDrivingCenter ? "/driving-center/dashboard" : "/user/dashboard"}>
                            <Search className="mr-2 size-4" />
                            {isDrivingCenter ? "Dashboard" : "Discover"}
                        </Link>
                    </Button>

                    {!isDrivingCenter && (
                        <>
                            <Button
                                variant="ghost"
                                asChild
                                className="text-[#334155] hover:bg-blue-50 hover:text-[#2563EB]"
                            >
                                <Link to="/user/map">
                                    <MapPinned className="mr-2 size-4" />
                                    Map
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                asChild
                                className="text-[#334155] hover:bg-blue-50 hover:text-[#2563EB]"
                            >
                                <Link to="/user/bookings">
                                    <CalendarDays className="mr-2 size-4" />
                                    Bookings
                                </Link>
                            </Button>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <span className="hidden text-sm text-slate-600 md:inline">
                        Hi, {name}
                    </span>

                    {!isDrivingCenter && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="relative border-slate-200 bg-white/80 text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB]"
                                >
                                    <Bell className="size-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="end"
                                className="w-[340px] border-slate-200 bg-white p-0 text-[#1E293B] shadow-lg"
                            >
                                <div className="border-b border-slate-200 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-900">
                                            Notifications
                                        </h3>
                                        {unreadCount > 0 && (
                                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                                {unreadCount} unread
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {isNotificationsLoading ? (
                                        <div className="px-4 py-6 text-sm text-slate-500">
                                            Loading notifications...
                                        </div>
                                    ) : recentNotifications.length === 0 ? (
                                        <div className="px-4 py-6 text-sm text-slate-500">
                                            No notifications yet.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {recentNotifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleNotificationClick(notification.id)
                                                    }
                                                    className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 ${
                                                        notification.isRead
                                                            ? "bg-white"
                                                            : "bg-blue-50/50"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 space-y-1">
                                                            <p className="font-medium text-slate-900">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(
                                                                    notification.createdAt
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        {!notification.isRead && (
                                                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-200 px-4 py-2">
                                    <p className="text-xs text-slate-500">
                                        Showing latest {Math.min(recentNotifications.length, 5)} notifications
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-slate-200 bg-white/80 text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB]"
                            >
                                <User2 className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="border-slate-200 bg-white text-[#1E293B]"
                        >
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate(
                                        isDrivingCenter
                                            ? "/driving-center/profile"
                                            : "/user/profile"
                                    )
                                }
                                className="cursor-pointer text-[#1E293B] focus:bg-blue-50 focus:text-[#2563EB]"
                            >
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-[#1E293B] focus:bg-blue-50 focus:text-[#2563EB]"
                            >
                                <LogOut className="mr-2 size-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}