"use client";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface IWorkspace {
  WorkSpaceID: number;
  CoverImg: string;
  Emoji: string;
  Enterd: string;
  EnterdOn: string;
  WorkSpaceName: string;
}

function WorkspaceItemList({
  workspaceList,
  layoutMode,
}: {
  workspaceList: IWorkspace[];
  layoutMode: "grid" | "list";
}) {
  const router = useRouter();

  const OnClickWorkspaceItem = (workspaceId: number) => {
    router.push(`/dashboard/workspace?workspaceId=${workspaceId}`);
  };

  return (
    <div
      className={`mt-6 ${
        layoutMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
      }`}
    >
      {workspaceList?.map((workspace, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
              layoutMode === "list" ? "flex items-center gap-4 p-4" : ""
            }`}
            onClick={() => OnClickWorkspaceItem(workspace.WorkSpaceID)}
          >
            <CardHeader>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar className="w-full h-[150px] rounded-t-lg">
                  <AvatarImage
                    src={workspace.CoverImg || "/assets/cover.jpg"}
                    alt="Workspace Cover"
                    className="object-cover"
                  />
                  <AvatarFallback>{workspace.Emoji || "😊"}</AvatarFallback>
                </Avatar>
              </motion.div>
            </CardHeader>
            <CardContent className={layoutMode === "list" ? "p-0" : "p-4"}>
              <CardTitle className="flex items-center gap-2">
                <span>{workspace.Emoji || "😊"}</span>
                <span className="text-lg font-semibold">
                  {workspace.WorkSpaceName}
                </span>
              </CardTitle>
              <CardDescription className="mt-2">
                <p className="text-sm text-gray-600">{workspace.Enterd}</p>
                <p className="text-xs text-gray-500">
                  Entered on:{" "}
                  {format(new Date(workspace.EnterdOn), "MMM do, yyyy")}
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default memo(WorkspaceItemList);
