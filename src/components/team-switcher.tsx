"use client";

import * as React from "react";
import Link from "next/link";
import TypeIt from "typeit-react";
import { SidebarMenu } from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <SidebarMenu className="flex flex-col items-start">
      <Link
        href="/dashboard"
        className="w-fit px-1.5 flex items-center gap-0.5"
      >
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
          <img src="/assets/icon.png" alt="naturub-logo" />
        </div>
        <span className="truncate font-medium">Naturub Accessories BD</span>
      </Link>
      <small className="px-1.5">
        <TypeIt options={{loop: true, speed: 280, loopDelay: 20}}>Knowledge Share Web Application</TypeIt>
      </small>
    </SidebarMenu>
  );
}
