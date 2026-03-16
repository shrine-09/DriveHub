import Threads from "@/components/Threads.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HoverBorderGradient} from "@/components/ui/hover-border-gradient.tsx";
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    
    return (
        <div>
            {/* Fullscreen Background */}

            <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <Threads
                    amplitude={1}
                    distance={0}
                    enableMouseInteraction={true}
                />
            </div>

            {/* Navbar */}
            <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 cursor-pointer pointer-events-auto">
                <div className="text-xl font-semibold text-white drop-shadow">DriveHub</div>
                
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 bg-transparent text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] cursor-pointer hover:shadow-lg"
                    >
                        Log in
                    </Button>
                    
                    <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        onClick={() => navigate("/register")}
                        className="dark:bg-black bg-white text-black text-sm font-semibold dark:text-white flex items-center cursor-pointer space-x-2"
                    >
                        Join Us
                    </HoverBorderGradient>
                </div>
            </header>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-white text-5xl font-bold drop-shadow-lg">DriveHub</h1>
            </div>

            {/* Login/Register */}
            
            
        </div>
    )
}