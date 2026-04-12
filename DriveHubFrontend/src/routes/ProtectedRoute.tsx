import { Navigate, useLocation } from "react-router-dom";

type Role = "Admin" | "DrivingCenter" | "User";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: Role[];
};

export default function ProtectedRoute({
                                           children,
                                           allowedRoles,
                                       }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const location = useLocation();
    const mustChangePassword = localStorage.getItem("mustChangePassword");
    const isProfileComplete = localStorage.getItem("isProfileComplete");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (
        mustChangePassword === "true" &&
        location.pathname !== "/change-password"
    ) {
        return <Navigate to="/change-password" replace />;
    }

    if (
        role === "DrivingCenter" &&
        isProfileComplete === "false" &&
        location.pathname !== "/driving-center/setup-profile" &&
        location.pathname !== "/change-password"
    ) {
        return <Navigate to="/driving-center/setup-profile" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role as Role))) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}