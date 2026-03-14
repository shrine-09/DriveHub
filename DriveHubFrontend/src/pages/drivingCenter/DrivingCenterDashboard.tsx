export default function DrivingCenterDashboard() {
    const name = localStorage.getItem("name");

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold">Welcome Driving Center</h1>
                <p className="text-muted-foreground">
                    {name ? `Hello, ${name}` : "Hello, Driving Center"}
                </p>
            </div>
        </div>
    );
}