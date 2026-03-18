import { Link } from "react-router-dom";
import { MapPinned, Search, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserLayout from "@/components/user/UserLayout";

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
                <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#ECA72C]/20 via-slate-950 to-[#F95738]/20 p-6 shadow-sm md:p-10">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Badge className="rounded-full border border-[#ECA72C]/20 bg-[#ECA72C]/10 px-3 py-1 text-[#ffd58a] hover:bg-[#ECA72C]/10">
                            Welcome back
                        </Badge>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Welcome, {name}
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                                Discover verified driving centers, compare options, and explore
                                locations on a map to find the one that fits you best.
                            </p>
                        </div>

                        <div className="max-w-2xl">
                            <Input
                                placeholder="Search driving centers by name or location"
                                className="border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400 focus-visible:ring-[#F95738]"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                asChild
                                className="bg-[#F95738] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f26a50]"
                            >
                                <Link to="/user/search">
                                    <Search className="mr-2 size-4" />
                                    Search Centers
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-white/10 bg-white/5 text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ECA72C]/10"
                            >
                                <Link to="/user/map">
                                    <MapPinned className="mr-2 size-4" />
                                    Explore on Map
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Featured Driving Centers
                            </h2>
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
                                className="group border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F95738]/20 hover:bg-white/[0.05] hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 120}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-lg">{center.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {center.location}
                                            </CardDescription>
                                        </div>

                                        {center.verified && (
                                            <Badge className="gap-1 border border-[#ECA72C]/20 bg-[#ECA72C]/10 text-[#ffd58a] hover:bg-[#ECA72C]/10">
                                                <BadgeCheck className="size-3.5" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Type</span>
                                        <Badge
                                            variant="secondary"
                                            className="bg-[#F95738]/10 text-[#ffb29f]"
                                        >
                                            {center.type}
                                        </Badge>
                                    </div>

                                    <Button className="w-full bg-[#F95738] text-white transition-all duration-300 group-hover:-translate-y-0.5 hover:bg-[#f26a50]">
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