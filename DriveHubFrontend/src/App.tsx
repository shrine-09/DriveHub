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
import UserSearchPage from "@/pages/user/UserSearchPage.tsx";
import UserMapPage from "@/pages/user/UserMapPage.tsx";
import UserBookingsPage from "@/pages/user/UserBookingsPage.tsx";
import UserProfilePage from "@/pages/user/UserProfilePage.tsx";
import PendingDrivingCentersPage from "@/pages/admin/PendingDrivingCentersPage.tsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.tsx";
import RegisteredDrivingCentersPage from "@/pages/admin/RegisteredDrivingCentersPage.tsx";
import DrivingCenterSetupProfilePage from "@/pages/drivingCenter/DrivingCenterSetupProfilePage.tsx";
import NewLearnersPage from "@/pages/drivingCenter/NewLearnersPage.tsx";
import ActiveLearnersPage from "@/pages/drivingCenter/ActiveLearnersPage.tsx";
import InactiveLearnersPage from "@/pages/drivingCenter/InactiveLearnersPage.tsx";
import DrivingCenterDetailsPage from "@/pages/user/DrivingCenterDetailsPage.tsx";


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
                    path={"/admin/driving-centers/pending"}
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <PendingDrivingCentersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={"/admin/users"}
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminUsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/admin/driving-centers/registered"}
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <RegisteredDrivingCentersPage />
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
                    path={"/user/search"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserSearchPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/user/map"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserMapPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/user/bookings"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserBookingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/user/centers/:id"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <DrivingCenterDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/user/profile"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/user/search"}
                    element={
                        <ProtectedRoute allowedRoles={["User"]}>
                            <UserSearchPage />
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
                    path={"/driving-center/setup-profile"}
                    element={
                        <ProtectedRoute allowedRoles={["DrivingCenter"]}>
                            <DrivingCenterSetupProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/driving-center/new-learners"}
                    element={
                        <ProtectedRoute allowedRoles={["DrivingCenter"]}>
                            <NewLearnersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/driving-center/active-learners"}
                    element={
                        <ProtectedRoute allowedRoles={["DrivingCenter"]}>
                            <ActiveLearnersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={"/driving-center/inactive-learners"}
                    element={
                        <ProtectedRoute allowedRoles={["DrivingCenter"]}>
                            <InactiveLearnersPage />
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

