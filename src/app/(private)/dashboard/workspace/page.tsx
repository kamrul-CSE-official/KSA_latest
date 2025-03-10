"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateADocumentMutation,
  useWorkspaceListMutation,
} from "@/redux/services/ideaApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import IdeaInfo from "./_components/IdeaInfo";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Calendar,
  Edit,
  Loader2,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkspaceUpdate from "./_components/WorkspaceUpdate";

interface IWorkspaceDetails {
  CoverImg: string;
  Emoji: string;
  EnterDept: string;
  EnterImg: string;
  EnterSec: string;
  EnterdDesg: string;
  EnterdName: string;
  EnterdOn: string;
  IdeaEmoji: string;
  IdeaId: string;
  IdeaTitle: string;
  IdeaEnterdOn: string;
  WorkSpaceName: string;
  ShareTypeName: "Public" | "Private" | "Custom";
}

export default function WorkspacePage() {
  const [docCreate, setDocCreate] = useState(false);
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const [updateIdeaReq] = useCreateADocumentMutation();
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [workspaceDetailsReq, { isLoading }] = useWorkspaceListMutation();
  const [workspaceData, setWorkspaceData] = useState<
    IWorkspaceDetails[] | null
  >(null);

  useEffect(() => {
    if (workspaceId) {
      workspaceDetailsReq({ Type: 5, WorkSpaceID: workspaceId }).then((res) => {
        if (res.data) {
          setWorkspaceData(res.data);
        }
      });
    }
  }, [workspaceId, workspaceDetailsReq]);

  const handleDocument = () => {
    setDocCreate(!docCreate);
    async function createdAd() {
      const req = await updateIdeaReq({
        Title: "Untitled Document",
        CompanyID: userData?.CompanyID,
        EnteredBy: userData?.EmpID,
        WorkSpaceID: workspaceId,
      });
      // console.log(req.data?.[0]?.IdeaID, req.data[0])
      if (req?.data?.[0]?.IdeaID) {
        setDocCreate(!docCreate);
      }
      router.push(
        `/dashboard/document/?ideaId=${req.data?.[0]?.IdeaID}&workspaceId=${workspaceId}`
      );
    }

    createdAd();
  };

  if (isLoading || !workspaceData) {
    return (
      <div className="px-4">
        <Skeleton className="h-64 w-full rounded-xl mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-1/3" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-1/4 mt-8" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3]?.map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const workspace = workspaceData[0];
  const shareTypeColor = {
    Public: "bg-green-100 text-green-800",
    Private: "bg-red-100 text-red-800",
    Custom: "bg-blue-100 text-blue-800",
  }[workspace?.ShareTypeName];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4"
    >
      <Card className="overflow-hidden mb-8 shadow-lg">
        <div className="relative h-64 z-50">
          <WorkspaceUpdate>
            <Button className="absolute top-5 left-5 z-50">
              <Edit className="text-white cursor-pointer" />
            </Button>
          </WorkspaceUpdate>
          {typeof window !== "undefined" && (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              src={workspace?.CoverImg || "/assets/cover.png"}
              alt="workspace-cover"
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2"
            >
              {workspace?.Emoji && (
                <span className="mr-2">{workspace?.Emoji}</span>
              )}
              {workspace?.WorkSpaceName}
            </motion.h1>
            <Badge className={`${shareTypeColor} mt-2`}>
              {workspace?.ShareTypeName}
            </Badge>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage
                  src={
                    workspace?.EnterImg
                      ? `data:image/jpeg;base64,${workspace?.EnterImg}`
                      : "https://avatar.iran.liara.run/public/26"
                  }
                />
                <AvatarFallback>
                  {workspace?.EnterdName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <small className="font-bold">{workspace?.EnterdName}</small>
                <br />
                <small className="text-muted-foreground">
                  {workspace?.EnterdDesg}
                </small>
                <TooltipProvider>
                  <div className="flex -space-x-1 overflow-hidden">
                    <Tooltip>
                      <TooltipTrigger>
                        <img
                          className="inline-block size-6 rounded-full ring-2 ring-white cursor-pointer"
                          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Kamrul <br /> <small>CSE</small>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <img
                          className="inline-block size-6 rounded-full ring-2 ring-white cursor-pointer"
                          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Kamrul <br /> <small>CSE</small>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <img
                          className="inline-block size-6 rounded-full ring-2 ring-white cursor-pointer"
                          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Kamrul <br /> <small>CSE</small>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <img
                          className="inline-block size-6 rounded-full ring-2 ring-white cursor-pointer"
                          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Kamrul <br /> <small>CSE</small>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users size={16} />
                <span>{workspace?.EnterSec}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building2 size={16} />
                <span>{workspace?.EnterDept}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar size={16} />
                <span suppressHydrationWarning>
                  {(() => {
                    try {
                      return workspace?.EnterdOn
                        ? format(new Date(workspace?.EnterdOn), "MMM do, yyyy")
                        : "Not Available";
                    } catch (error) {
                      return "Invalid Date";
                    }
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Share2 size={16} />
                <span>{workspace?.ShareTypeName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button
              onClick={handleDocument}
             className="bg-gray-100 hover:bg-gray-300"
              variant="ghost"
              disabled={docCreate}
            >
              {docCreate ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {workspaceData?.length}{" "}
            {workspaceData?.length === 1 ? "Document" : "Documents"}
          </Badge>
        </div>

        <div className="space-y-4">
          {workspaceData?.map((workspace, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.01 }}
              className="transition-all"
            >
              {typeof window !== "undefined" && workspace?.IdeaId ? (
                <IdeaInfo
                  docCreate={docCreate}
                  setDocCreate={setDocCreate}
                  IdeaID={workspace?.IdeaId}
                />
              ) : (
                <Button onClick={() => handleDocument()}>
                  {docCreate ? "Loading..." : "Create An Idea Document"}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
