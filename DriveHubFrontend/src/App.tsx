// import {ModeToggle} from "@/components/mode-toggle.tsx";
import LandingPage from "@/pages/landingPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "@/pages/auth/loginForm.tsx";
import RegisterPage from "@/pages/auth/registerForm.tsx";
import CentersRegisterPage from "@/pages/auth/centersRegisterForm.tsx";
import AdminDashboard from "@/pages/admin/adminDashboard.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<LandingPage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/register"} element={<RegisterPage />} />
                <Route path={"/centersRegister"} element={<CentersRegisterPage />} />
                <Route path={"/admin/dashboard"} element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

