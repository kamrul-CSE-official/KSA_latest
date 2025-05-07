"use client";

import { FileStack, LayoutDashboard, SearchIcon, Workflow } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Search from "@/app/(private)/dashboard/_components/Search";
import Link from "next/link";
import AskAI from "@/app/(private)/dashboard/_components/AskAI";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface IItem {
  title: string;
  url: string;
  icon: React.ReactElement;
  isActive?: boolean;
}

const NavMain = function () {
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  const items: IItem[] = [
    { title: "Search", url: "#", icon: <SearchIcon />, isActive: false },
    {
      title: "Dashboard",
      url: "/dashboard/",
      icon: <LayoutDashboard />,
      isActive: false,
    },
    // { title: "Ask AI", url: "/#", icon: <Sparkles />, isActive: false },
    {
      title: "Workspace",
      url: "/dashboard/workspaces/",
      icon: <Workflow />,
      isActive: isActive("/dashboard/workspaces"),
    },
    {
      title: "Issues",
      url: "/dashboard/issues",
      icon: <FileStack />,
      isActive: isActive("/dashboard/issues"),
    },
  ];

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton className="w-full" isActive={item.isActive}>
            {item.title === "Search" ? (
              <Search>
                <div className="w-full cursor-pointer flex items-start justify-start">
                  <p className="flex items-center gap-2">
                    <span>{item.icon}</span> {item.title}
                  </p>
                </div>
              </Search>
            ) : item.title === "Ask AI" ? (
              <AskAI>
                <div className="w-full cursor-pointer flex items-start justify-start">
                  <p className="flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    <span className="text-orange-400">{item.icon}</span>{" "}
                    {item.title}
                  </p>
                </div>
              </AskAI>
            ) : (
              <Link href={item.url} className="w-full">
                <div className="w-full cursor-pointer flex items-start justify-start">
                  <p className="flex items-center gap-2">
                    <span>{item.icon}</span> {item.title}
                  </p>
                </div>
              </Link>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default memo(NavMain);
