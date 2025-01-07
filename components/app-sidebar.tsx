"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  CircleCheck,
  CloudUpload,
  Inbox,
  LogOut,
  SquareArrowOutUpRightIcon,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Logo from "@/public/hit_logo.png";
import { useAuth } from "@/hooks/useAuth"; // Import the auth hook
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setUserRole(role);
      }
    }
  }, [user, role, loading, router]);

  const navigationItems = React.useMemo(() => {
    if (!userRole) return [];

    const items = [];

    // Add role-specific items
    if (userRole === "user") {
      items.push(
        { title: "Profile", icon: UserRound, href: "/student/profile" },
        { title: "Application", icon: SquareArrowOutUpRightIcon, href: "/student/application" }
      );
    } else if (userRole === "admin") {
      items.push(
        { title: "Applications", icon: Inbox, href: "/admin/applications" },
        { title: "Accepted", icon: CircleCheck, href: "/admin/accepted" },
        { title: "Archived", icon: Archive, href: "/admin/archived" }
      );
    }

    // Common items
    items.push({ title: "Published", icon: CloudUpload, href: "/accepted-students" });

    return items;
  }, [userRole]);

  if (loading || !userRole) {
    return null; 
  }

  return (
    <Sidebar className="w-[150px]">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" width={200} height={200} />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenu className="space-y-4">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="w-full h-fit">
                  <div className="flex flex-col items-center w-full space-y-1">
                    <item.icon className="h-6 w-6 text-blue-900" />
                    <p className="text-xs">{item.title}</p>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
