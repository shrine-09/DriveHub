import { MapPinned, Search, CalendarDays, BadgeCheck, ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserLayout from "@/components/user/UserLayout";
import { Link } from "react-router-dom";

const featuredCenters = [
    {
        id: 1,
        name: "Everest Driving Center",
        location: "Baneshwor, Kathmandu",
        type: "Private",
        verified: true,
    },
    {
        id: 2,
        name: "Bagmati Driving Academy",
        location: "Satdobato, Lalitpur",
        type: "Private",
        verified: true,
    },
    {
        id: 3,
        name: "Valley Wheels Training Hub",
        location: "Chabahil, Kathmandu",
        type: "Public",
        verified: false,
    },
];

export default function UserDashboard() {
    const name = localStorage.getItem("name") || "User";

    return (
        <UserLayout>
            <div className="space-y-8">
                <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/50 p-6 shadow-sm transition-all duration-500 md:p-10">
                    <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Badge variant="secondary" className="rounded-full px-3 py-1">
                                Welcome back
                            </Badge>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                    Find the right driving center, {name}
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                    Discover verified driving centers, compare options, explore locations on the map,
                                    and manage your bookings from one place.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button size="lg" asChild className="transition-all duration-300 hover:-translate-y-0.5">
                                    <Link to="/user/search">
                                        <Search className="mr-2 size-4" />
                                        Search Centers
                                    </Link>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <Link to="/user/map">
                                        <MapPinned className="mr-2 size-4" />
                                        Explore on Map
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <Card className="border-muted/70 shadow-md transition-all duration-500 hover:-translate-y-1">
                            <CardHeader>
                                <CardTitle>Quick Search</CardTitle>
                                <CardDescription>
                                    Jump straight into finding a driving center near you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input placeholder="Search by location or driving center name" />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Button asChild>
                                        <Link to="/user/search">Start Search</Link>
                                    </Button>
                                    <Button variant="secondary" asChild>
                                        <Link to="/user/bookings">My Bookings</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Search className="size-5" />
                                Search
                            </CardTitle>
                            <CardDescription>Browse centers by area, company name, or filters.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPinned className="size-5" />
                                Map Based Discovery
                            </CardTitle>
                            <CardDescription>See nearby centers and explore locations visually.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CalendarDays className="size-5" />
                                Bookings
                            </CardTitle>
                            <CardDescription>Track your requests, visits, or training schedules.</CardDescription>
                        </CardHeader>
                    </Card>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Featured Driving Centers</h2>
                            <p className="text-sm text-muted-foreground">
                                A few highlighted centers to help you get started.
                            </p>
                        </div>

                        <Button variant="ghost" asChild>
                            <Link to="/user/search">
                                View all
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {featuredCenters.map((center, index) => (
                            <Card
                                key={center.id}
                                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 120}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-lg">{center.name}</CardTitle>
                                            <CardDescription className="mt-1">{center.location}</CardDescription>
                                        </div>

                                        {center.verified && (
                                            <Badge className="gap-1">
                                                <BadgeCheck className="size-3.5" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Type</span>
                                        <Badge variant="secondary">{center.type}</Badge>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock3 className="size-4" />
                                        Explore details and availability
                                    </div>

                                    <Button className="w-full transition-all duration-300 group-hover:-translate-y-0.5">
                                        View Center
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </UserLayout>
    );
}