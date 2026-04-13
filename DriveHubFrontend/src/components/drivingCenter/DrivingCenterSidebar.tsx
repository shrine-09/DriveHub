import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UserPlus,
    Users,
    UserX,
    Settings,
    LogOut,
    ClipboardCheck,
    BarChart3,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navSections = [
    {
        title: "Overview",
        items: [
            {
                label: "Dashboard",
                path: "/driving-center/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Learners",
        items: [
            {
                label: "New Learners",
                path: "/driving-center/new-learners",
                icon: UserPlus,
            },
            {
                label: "Active Learners",
                path: "/driving-center/active-learners",
                icon: Users,
            },
            {
                label: "Inactive Learners",
                path: "/driving-center/inactive-learners",
                icon: UserX,
            },
        ],
    },
    {
        title: "Training",
        items: [
            {
                label: "Mark Attendance",
                path: "/driving-center/mark-attendance",
                icon: ClipboardCheck,
            },
            {
                label: "Reports",
                path: "/driving-center/reports",
                icon: BarChart3,
            },
        ],
    },
];

const bottomNavItems = [
    {
        label: "Profile",
        path: "/driving-center/profile",
        icon: Settings,
    },
];

type DrivingCenterSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function DrivingCenterSidebar({
                                                 isOpen,
                                                 onClose,
                                             }: DrivingCenterSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "Driving Center";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mustChangePassword");
        localStorage.removeItem("isProfileComplete");
        navigate("/login");
    };

    const handleNavigate = () => {
        onClose();
    };

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-[#F8F7F4]/95 backdrop-blur transition-transform duration-300 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Link
                                to="/driving-center/dashboard"
                                onClick={handleNavigate}
                                className="text-xl font-bold text-[#1E293B]"
                            >
                                DriveHub
                            </Link>
                            <p className="mt-1 text-sm text-slate-500">
                                Driving Center Panel
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="mt-[-4px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                        >
                            <X className="size-5" />
                        </Button>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <p className="text-sm text-slate-500">Signed in as</p>
                    <p className="font-medium text-slate-900">{name}</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="space-y-6">
                        {navSections.map((section) => (
                            <div key={section.title}>
                                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {section.title}
                                </p>

                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;

                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={handleNavigate}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                                    isActive
                                                        ? "bg-blue-50 text-[#2563EB]"
                                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                            >
                                                <Icon className="size-4" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Settings
                        </p>

                        <div className="space-y-1">
                            {bottomNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleNavigate}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-50 text-[#2563EB]"
                                                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                <div className="border-t border-slate-200 p-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer justify-start border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            >
                                <LogOut className="mr-2 size-4" />
                                Logout
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="border-slate-200 bg-white text-slate-900">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Logout from DriveHub?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600">
                                    You will be signed out of your driving center account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                                >
                                    Yes, Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </aside>
        </>
    );
}