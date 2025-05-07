"use client";

import * as React from "react";

// import { NavFavorites } from "@/components/nav-favorites";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProfileButton } from "./profile-btn";
import NavMain from "./nav-main";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFavorites favorites={data.favorites} /> */}
        <NavWorkspaces />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarRail />
       <ProfileButton />
    </Sidebar>
  );
}
