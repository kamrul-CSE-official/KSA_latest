"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home,
  Layers,
  FileText,
  Folder,
  GitBranch,
  Plus,
  LucideIcon,
} from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

interface SulationLeftSidebarProps {
  className?: string;
  setLeftNavState: (index: number) => void;
  leftNavState: number;
}

const getIconForLabel = (label: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    "Root Cause": Home,
    Assumption: Layers,
    Claim: FileText,
    Opinion: Folder,
    Conclusion: GitBranch,
  };
  return iconMap[label] || Folder;
};

const labels = ["Root Cause", "Assumption", "Claim", "Opinion", "Conclusion"];

const SulationLeftSidebar = ({
  className,
  setLeftNavState,
  leftNavState,
}: SulationLeftSidebarProps) => {
  const mainMenuItems: MenuItem[] = labels.map((label) => ({
    label,
    href: "#",
    icon: getIconForLabel(label),
  }));

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>

      <div className="flex-1 space-y-6 px-4 py-2">
        <div className="space-y-2">
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {mainMenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => setLeftNavState(mainMenuItems.length + index)}
                >
                  <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sidebar Menu */}
          <nav className="space-y-1">
            {mainMenuItems.map((item, index) => (
              <Button
                key={item.label}
                onClick={() => setLeftNavState(index)}
                variant={leftNavState === index ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <Separator />
      </div>
    </div>
  );
};

export default SulationLeftSidebar;
