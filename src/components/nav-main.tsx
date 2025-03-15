"use client";

import { LayoutList, SearchIcon, Sparkles } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Search from "@/app/(private)/dashboard/_components/Search";
import Link from "next/link";
import AskAI from "@/app/(private)/dashboard/_components/AskAI";

export function NavMain() {
  interface IItem {
    title: string;
    url: string;
    icon: React.ReactElement;
    isActive?: boolean;
  }

  const items: IItem[] = [
    { title: "Search", url: "#", icon: <SearchIcon />, isActive: false },
    { title: "Ask AI", url: "/#", icon: <Sparkles />, isActive: false },
    {
      title: "Workspace",
      url: "/dashboard",
      icon: <LayoutList />,
      isActive: true,
    },
  ];

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {/* SidebarMenuButton expects a single child */}
          <SidebarMenuButton className="w-full" isActive={item.isActive}>
            {item?.title === "Search" ? (
              <Search>
                {/* Wrap content with a single div to avoid multiple children */}
                <div className="w-full cursor-pointer flex items-start justify-start">
                  <p className="flex items-center gap-2">
                    <span>{item.icon}</span> {item.title}
                  </p>
                </div>
              </Search>
            ) : item?.title === "Ask AI" ? (
              <AskAI>
                {/* Wrap content with a single div to avoid multiple children */}
                <div className="w-full cursor-pointer flex items-start justify-start">
                  <p className="flex items-center gap-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    <span className="text-orange-400">{item.icon}</span> {item.title}
                  </p>
                </div>
              </AskAI>
            ) : (
              <Link href={item.url} className="w-full">
                {/* Wrap content with a single div to avoid multiple children */}
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
}
