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
  EnterdBy: number;
  FULL_NAME: string;
  IMAGE: string;
  SECNAME: string;
  ShareTypeID: number;
  ShareTypeName: string;
  EnterdOn: string;
  WorkSpaceName: string;
}

function IdeaItemList({
  ItemsList,
  layoutMode,
}: {
  ItemsList: IWorkspace[];
  layoutMode: "grid" | "list";
}) {
  const router = useRouter();

  console.log("LLLLLL  : ", ItemsList);

  const OnClickWorkspaceItem = (workspaceId: number, IdeaID: number) => {
    router.push(
      `/dashboard/document/?ideaId=${IdeaID}&workspaceId=${workspaceId}`
    );
  };

  return (
    <div
      className={`mt-6 ${
        layoutMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
      }`}
    >
      {ItemsList?.map((workspace: any, index: number) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
              layoutMode === "list" ? "flex items-center gap-4 p-4" : ""
            }`}
            onClick={() =>
              OnClickWorkspaceItem(workspace.WorkSpaceID, workspace.IdeaID)
            }
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
                  {workspace.Title} 
                </span>
              </CardTitle>
              <CardDescription className="mt-2">
                <p className="text-sm text-gray-600">{workspace.FULL_NAME}</p>
                <p className="text-xs text-gray-500">
                  Entered on:{" "}
                  {format(new Date(workspace.EnterdOn), "MMM do, yyyy")}
                </p>
                <p>{workspace.ShareTypeName}</p>
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default memo(IdeaItemList);
