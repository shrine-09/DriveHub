import { Link, useNavigate } from "react-router-dom";
import { MapPinned, Search, CalendarDays, User2, LogOut, GalleryVerticalEnd } from "lucide-react";
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("mustChangePassword");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80">
                    <GalleryVerticalEnd className="size-5" />
                    <span>DriveHub</span>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    <Button variant="ghost" asChild>
                        <Link to="/user/dashboard">
                            <Search className="mr-2 size-4" />
                            Discover
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link to="/user/map">
                            <MapPinned className="mr-2 size-4" />
                            Map
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link to="/user/bookings">
                            <CalendarDays className="mr-2 size-4" />
                            Bookings
                        </Link>
                    </Button>
                </nav>

                <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground md:inline">
            Hi, {name}
          </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <User2 className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
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