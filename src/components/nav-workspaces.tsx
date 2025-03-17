"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useDashboardMutation,
  useGetIdeaWhrowWorkspaceMutation,
  useWorkspaceListMutation,
} from "@/redux/services/ideaApi";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

// Workspace Type Definition
interface IWorkspace {
  WorkSpaceName: string;
  Emoji: string;
  WorkSpaceID: number;
}

export function NavWorkspaces() {
  const loggedInUser = useSelector((state: RootState) => state.user.userData);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [workspaceReq, { isLoading, data: workspaces }] =
    useWorkspaceListMutation();
  const [workspaceDashboardReq] = useDashboardMutation();

  useEffect(() => {
    workspaceDashboardReq({});
  }, []);

  useEffect(() => {
    if (loggedInUser?.CompanyID && loggedInUser?.EmpID) {
      workspaceReq({
        Type: 0,
        CompanyID: loggedInUser.CompanyID,
        EnterdBy: loggedInUser.EmpID,
        Page: 1,
        Limit: 10,
      });
    }
  }, [loggedInUser]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <div>Loading...</div>}

          {workspaces?.map((workspace: any, i: number) => (
            <Collapsible key={i} className="w-full">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex justify-between w-full"
                  onClick={() =>
                    setExpanded((prev) =>
                      prev === workspace.WorkSpaceID
                        ? null
                        : workspace.WorkSpaceID
                    )
                  }
                >
                  <span>
                    {workspace.Emoji} {workspace.WorkSpaceName}
                  </span>
                  <Plus
                    className={`transition-transform ${
                      expanded === workspace.WorkSpaceID ? "rotate-45" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-gray-100 rounded"
                >
                  <SidebarChild workspaceId={workspace.WorkSpaceID} />
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function SidebarChild({ workspaceId }: { workspaceId: number }) {
  const [ideaReq, { data }] = useGetIdeaWhrowWorkspaceMutation();

  useEffect(() => {
    if (workspaceId) {
      ideaReq({ WorkSpaceID: workspaceId });
    }
  }, [workspaceId]);

  // console.log("child: ", data);

  return (
    <>
      {data?.map((idea: any, i: number) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton asChild>
            <Link href={`/dashboard/document/?ideaId=${idea?.IdeaID}&workspaceId=${workspaceId}`}>
              {idea?.Title} 
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
