import * as React from "react";
import {
  IconClipboardList,
  IconDashboard,
  IconUsers,
  IconBuildingCommunity,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: localStorage.getItem("name") || "Admin",
    email: localStorage.getItem("email") || "admin@drivehub.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
  ],
  documents: [
    {
      name: "Pending Applications",
      url: "/admin/driving-centers/pending",
      icon: IconClipboardList,
    },
    {
      name: "Registered Centers",
      url: "/admin/driving-centers/registered",
      icon: IconBuildingCommunity,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("mustChangePassword");
    localStorage.removeItem("isProfileComplete");
    navigate("/login");
  };

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/admin/dashboard">
                  <span className="text-base font-semibold">DriveHub</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavDocuments items={data.documents} />
        </SidebarContent>

        <SidebarFooter>
          <div className="space-y-3 p-2">
            <div className="rounded-lg border px-3 py-2">
              <p className="text-sm font-medium">{data.user.name}</p>
              <p className="text-xs text-muted-foreground">{data.user.email}</p>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start cursor-pointer"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
  );
}