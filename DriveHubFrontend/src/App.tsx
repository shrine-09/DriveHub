// import {ModeToggle} from "@/components/mode-toggle.tsx";
import LandingPage from "@/pages/landingPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "@/pages/auth/LoginForm.tsx";
import RegisterPage from "@/pages/auth/RegisterForm.tsx";
import CentersRegisterPage from "@/pages/auth/CentersRegisterForm.tsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute";
import UserDashboard from "@/pages/user/UserDashboard.tsx";
import DrivingCenterDashboard from "@/pages/drivingCenter/DrivingCenterDashboard.tsx";
import ChangePasswordForm from "@/pages/auth/ChangePasswordForm.tsx";
import ForgotPasswordForm from "@/pages/auth/ForgotPasswordForm.tsx";
import ResetPasswordForm from "@/pages/auth/ResetPasswordForm.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<LandingPage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/register"} element={<RegisterPage />} />
                <Route path={"/centersRegister"} element={<CentersRegisterPage />} />
                <Route
                    path={"/admin/dashboard"}
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={"/user/dashboard"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/driving-center/dashboard"}
                    element={
                        <ProtectedRoute allowedRoles={["DrivingCenter"]}>
                            <DrivingCenterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={"/change-password"}
                    element={
                        <ProtectedRoute>
                            <ChangePasswordForm />
                        </ProtectedRoute>
                    }
                />
                <Route path={"/forgot-password"} element={<ForgotPasswordForm />} />
                <Route path={"/reset-password"} element={<ResetPasswordForm />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

