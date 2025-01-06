"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Building2,
  CircleCheck,
  CloudUpload,
  Files,
  Home,
  Inbox,
  LogOut,
  SquareArrowOutUpRightIcon,
  User,
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

// This would come from your auth system
let userRole = "admin"; // or 'admin'

export function AppSidebar() {
  const pathname = usePathname();

  const navigationItems = React.useMemo(() => {
    const items = [];

    // Add role-specific items
    if (userRole === "student") {
      items.push({
        title: "Profile",
        icon: UserRound,
        href: "/student/profile",
      });
      items.push({
        title: "Application",
        icon: SquareArrowOutUpRightIcon,
        href: "/student/application",
      });
    } else if (userRole === "admin") {
      items.push({
        title: "Applications",
        icon: Inbox,
        href: "/admin/applications",
      });
      items.push({
        title: "Accepted",
        icon: CircleCheck,
        href: "/admin/accepted",
      });
      items.push({
        title: "Archived",
        icon: Archive,
        href: "/admin/archived",
      });
    }
    items.push({
      title: "Published",
      icon: CloudUpload,
      href: "/accepted-students",
    });

    return items;
  }, []);

  return (
    <Sidebar className="w-[150px] ">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" width={200} height={200} />
        </div>
      </SidebarHeader>
      <SidebarContent className=" py-2">
        <SidebarMenu className="space-y-4 ">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="w-full h-fit">
                  <div className="flex flex-col items-center w-full space-y-1">
                    <item.icon className=" h-6 w-6 text-blue-900" />
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
