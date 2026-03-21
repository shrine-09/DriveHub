import { Link, useNavigate } from "react-router-dom";
import { MapPinned, Search, CalendarDays, User2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserNavbar() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "User";
    const role = localStorage.getItem("role");

    const isDrivingCenter = role === "DrivingCenter";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mustChangePassword");
        localStorage.removeItem("isProfileComplete");
        navigate("/login");
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