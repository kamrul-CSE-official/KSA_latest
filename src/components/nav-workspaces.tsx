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
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { encrypt } from "@/service/encryption"
import { IIssue } from "@/types/globelTypes";
import { useManageIssuesMutation } from "@/redux/services/issuesApi";

interface IWorkspace {
  WorkSpaceName: string;
  Emoji: string;
  WorkSpaceID: number;
}

export function NavWorkspaces() {
  const [issuesList, setIssuesList] = useState<IIssue[]>([])

  const [fetchIssues, { isLoading: loadingIncient }] = useManageIssuesMutation()

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



  useEffect(() => {
    const getInitialIssues = async () => {
      try {
        setIssuesList([])
        const response = await fetchIssues({
          Type: 2,
          PageSize: 1,
          PageNumber: 1,
          USER_ID: loggedInUser?.EmpID,
        }).unwrap()
        setIssuesList(response || [])
      } catch (error) {
        console.error("Failed to fetch issues:", error)
      }
    }
    getInitialIssues()
  }, [fetchIssues])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base font-bold">Recent Incidents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {loadingIncient && <div>Loading...</div>}
          {issuesList?.slice(0, 5).map((issue: IIssue, i: number) => (
            <Collapsible key={i}>
              <SidebarMenuItem>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <SidebarMenuButton asChild={true}>
                    <Link
                      href={`/dashboard/issues/issue/?issueId=${encrypt(issue.ID)}`}
                      target="_blank"
                    >
                      <small>{issue.TITLE}</small>
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


      {/* Kaizen */}
      <SidebarGroupLabel className="text-base font-bold">Recent Kaizens</SidebarGroupLabel>
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
                      <small>{workspace.WorkSpaceName}</small>
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
