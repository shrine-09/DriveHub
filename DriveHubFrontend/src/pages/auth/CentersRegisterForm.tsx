 "use client" 
 
 import {Link} from "react-router-dom";
 import {CentersRegisterForm} from "@/components/authentication/centerRegister-form.tsx";
 
 export default function CentersRegisterPage() {
    return (
        <div className="flex min-h-svh ">
            <div className={"w-[45%] flex flex-col"}>
                <div className="flex justify-center gap-2 md:justify-start top-0 left-0 p-6" style={{marginTop: 6.2}}>
                    <Link to={"/"} className="flex items-center gap-2 font-medium">
                        <div className="text-xl font-semibold text-white drop-shadow">DriveHub</div>
                    </Link>
                </div>
                <div className="bg-background flex min-h-[600px] flex-col items-center justify-center gap-6 p-6 md:p-10" style={{marginTop: -60}}>
                    <div className="w-full max-w-sm overflow-auto">
                        <CentersRegisterForm />
                    </div>
                </div>
            </div>

            <div className=" w-[55%] relative h-screen hidden lg:block">
                <img
                    src="/images/placeholder_sqaure.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />

                {/* Gradients for top and bottom of the image */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/100 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/100 to-transparent" />
            </div>
        </div>
    )
 }
 
 