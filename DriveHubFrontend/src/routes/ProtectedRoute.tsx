import { Navigate } from "react-router-dom";

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

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role as Role))) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}