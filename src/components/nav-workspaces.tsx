"use client";

import { Plus } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useDashboardMutation,
  useWorkspaceListMutation,
} from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { encrypt } from "@/service/encryption";

interface IWorkspace {
  WorkSpaceName: string;
  Emoji: string;
  WorkSpaceID: number;
}

export function NavWorkspaces() {
  const loggedInUser = useSelector((state: RootState) => state.user.userData);
  const [workspaceReq, { isLoading, data: workspaces }] =
    useWorkspaceListMutation();

  const [
    workspaceDashbordReq,
    { data: workspaceData, isLoading: workspaceLoading },
  ] = useDashboardMutation();

  useEffect(() => {
    workspaceDashbordReq({});
  }, []);

  useEffect(() => {
    workspaceReq({
      Type: 0,
      CompanyID: loggedInUser?.CompanyID,
      EnterdBy: loggedInUser?.EmpID,
      Page: 1,
      Limit: 10,
    });
  }, [loggedInUser, workspaceReq]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resent Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <div>Loading...</div>}
          {workspaces?.map((workspace: IWorkspace, i: number) => (
            <Collapsible key={i}>
              <SidebarMenuItem>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <SidebarMenuButton asChild={true}>
                    <Link
                      href={`/dashboard/workspace?workspaceId=${encrypt(
                        workspace?.WorkSpaceID
                      )}`}
                    >
                      <span>{workspace.Emoji}</span>
                      <span>{workspace.WorkSpaceName}</span>
                    </Link>
                  </SidebarMenuButton>
                </motion.div>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
