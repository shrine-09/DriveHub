import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
};

export default function AuthLayout({
                                       title,
                                       description,
                                       children,
                                       className,
                                   }: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh bg-background">
            <div className="absolute left-6 top-7.5">
                <Link to="/" className="flex items-center gap-2 font-medium cursor-pointer">
                    <span className="text-xl font-semibold">DriveHub</span>
                </Link>
            </div>

            <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
                <div className={cn("w-full max-w-sm space-y-6", className)}>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-xl font-bold">{title}</h1>
                        {description ? (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        ) : null}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}