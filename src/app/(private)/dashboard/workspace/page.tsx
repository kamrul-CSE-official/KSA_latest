"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState } from "@/redux/store";
import {
  useCreateADocumentMutation,
  useWorkspaceListMutation,
  useWorkspaceShareManageMutation,
} from "@/redux/services/ideaApi";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Building2,
  Calendar,
  Edit,
  FileText,
  Loader2,
  Plus,
  Share2,
  Users,
} from "lucide-react";

import IdeaInfo from "./_components/IdeaInfo";
import WorkspaceUpdate from "./_components/WorkspaceUpdate";
import Share from "./_components/share";

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
  EnterdBy: string;
  WorkSpaceName: string;
  ShareTypeName: "Public" | "Private" | "Custom";
}

interface SharedUser {
  PersonName: string;
  ITEM_IMAGE: string;
  EmpID: string;
  DesignationName?: string;
  Department?: string;
  Section?: string;
}

export default function WorkspacePage() {
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [workspaceData, setWorkspaceData] = useState<
    IWorkspaceDetails[] | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [createDocument] = useCreateADocumentMutation();
  const [fetchWorkspaceDetails, { isLoading: isLoadingWorkspace }] =
    useWorkspaceListMutation();
  const [fetchSharedUsers] = useWorkspaceShareManageMutation();

  // Fetch shared users
  useEffect(() => {
    const getSharedUsers = async () => {
      if (!workspaceId) return;

      try {
        const response = await fetchSharedUsers({
          Type: 3,
          WorkSpaceID: workspaceId,
        });

        if (response?.data) {
          setSharedUsers(response.data);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch shared users:", error);
        router.push("/dashboard");
      }
    };

    getSharedUsers();
  }, [workspaceId, fetchSharedUsers]);

  // Fetch workspace details
  useEffect(() => {
    const getWorkspaceDetails = async () => {
      if (!workspaceId) return;

      try {
        const response = await fetchWorkspaceDetails({
          Type: 5,
          WorkSpaceID: workspaceId,
        });

        if (response?.data) {
          setWorkspaceData(response.data);
          console.log("DDD::: ",response);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch workspace details:", error);
      }
    };

    getWorkspaceDetails();
  }, [workspaceId, fetchWorkspaceDetails, refreshTrigger, router]);

  const handleCreateDocument = async () => {
    if (!workspaceId || !userData?.CompanyID || !userData?.EmpID) {
      return;
    }

    setIsCreatingDoc(true);

    try {
      const response = await createDocument({
        Title: "Untitled Document",
        CompanyID: userData.CompanyID,
        EnteredBy: userData.EmpID,
        WorkSpaceID: workspaceId,
      });

      if (response?.data?.[0]?.IdeaID) {
        // Optimistically update the UI
        setWorkspaceData((prevData) =>
          prevData ? [...prevData, response.data[0]] : [response.data[0]]
        );
        setRefreshTrigger((prev) => prev + 1);
        setIsCreatingDoc(false);
        router.push(
          `/dashboard/document/?ideaId=${response.data[0].IdeaID}&workspaceId=${workspaceId}`
        );
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Function to handle updates from child components
  const handleDataUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isLoadingWorkspace || !workspaceData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-64 w-full rounded-xl mb-6" />
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-1/4 mt-8 mx-4" />
        <div className="mt-6 space-y-4 px-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const workspace = workspaceData[0];

  const shareTypeColor = {
    Public:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Private: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Custom: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  }[workspace?.ShareTypeName];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Workspace Header Card */}
      <Card className="overflow-hidden mb-8 shadow-lg border-muted/40">
        <div className="relative h-64 sm:h-72 md:h-80">
          <WorkspaceUpdate>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 left-4 z-10 bg-black/20 hover:bg-black/40 text-white border-white/20"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </WorkspaceUpdate>

          {typeof window !== "undefined" && (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              className="h-full w-full"
            >
              <img
                src={workspace?.CoverImg || "/assets/cover.png"}
                alt="Workspace Cover"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                {workspace?.Emoji && (
                  <span className="mr-2 text-4xl">{workspace?.Emoji}</span>
                )}
                <span className="break-words">{workspace?.WorkSpaceName}</span>
              </h1>
              <Badge className={`${shareTypeColor} mt-2 px-3 py-1`}>
                {workspace?.ShareTypeName}
              </Badge>
            </motion.div>
          </div>
        </div>

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/10 ring-2 ring-background">
                <AvatarImage
                  src={
                    workspace?.EnterImg
                      ? `data:image/jpeg;base64,${workspace?.EnterImg}`
                      : "https://avatar.iran.liara.run/public/26"
                  }
                  alt={workspace?.EnterdName || "Creator"}
                />
                <AvatarFallback>
                  {workspace?.EnterdName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{workspace?.EnterdName}</div>
                <div className="text-sm text-muted-foreground">
                  {workspace?.EnterdDesg}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Workspace Metadata */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users size={16} className="text-primary/70" />
                  <span>{workspace?.EnterSec}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 size={16} className="text-primary/70" />
                  <span>{workspace?.EnterDept}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar size={16} className="text-primary/70" />
                  <span suppressHydrationWarning>
                    {(() => {
                      try {
                        return workspace?.EnterdOn
                          ? format(
                              new Date(workspace?.EnterdOn),
                              "MMM do, yyyy"
                            )
                          : "Not Available";
                      } catch (error) {
                        return "Invalid Date";
                      }
                    })()}
                  </span>
                </div>
                {Number(userData?.EmpID) ==
                  Number(workspaceData[0]?.EnterdBy) && (
                  <Share>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1.5"
                    >
                      <Share2 size={16} className="text-primary/70" />
                      <span>Share</span>
                    </Button>
                  </Share>
                )}
              </div>

              {/* Shared Users Avatars */}
              {sharedUsers.length > 0 && (
                <TooltipProvider>
                  <div className="flex -space-x-2 overflow-hidden">
                    {sharedUsers.slice(0, 5).map((user, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-muted">
                            <AvatarImage
                              src={`data:image/jpeg;base64,${user?.ITEM_IMAGE}`}
                              alt={user?.PersonName || "User"}
                            />
                            <AvatarFallback>
                              {user?.PersonName?.substring(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="p-3">
                          <div className="font-medium">{user.PersonName}</div>
                          {user.DesignationName && (
                            <div className="text-sm text-muted-foreground">
                              {user.DesignationName}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            ID: {user.EmpID}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}

                    {sharedUsers.length > 5 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8 border-2 border-background bg-muted">
                            <AvatarFallback>
                              +{sharedUsers.length - 5}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          {sharedUsers.length - 5} more users
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button
              onClick={handleCreateDocument}
              size="sm"
              variant="outline"
              className="gap-1"
              disabled={isCreatingDoc}
            >
              {isCreatingDoc ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New
            </Button>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {workspaceData?.length}{" "}
            {workspaceData?.length === 1 ? "Document" : "Documents"}
          </Badge>
        </div>

        <AnimatePresence>
          <div className="space-y-4">
            {workspaceData?.length > 0 ? (
              workspaceData.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  exit={{ opacity: 0, y: -10 }}
                  className="transition-all"
                >
                  {typeof window !== "undefined" && item?.IdeaId ? (
                    <IdeaInfo
                      docCreate={isCreatingDoc}
                      setDocCreate={setIsCreatingDoc}
                      IdeaID={item?.IdeaId}
                      onUpdate={handleDataUpdate} // New prop to handle updates
                    />
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        No documents found in this workspace
                      </p>
                      <Button
                        onClick={handleCreateDocument}
                        disabled={isCreatingDoc}
                        className="mx-auto"
                      >
                        {isCreatingDoc ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Document
                          </>
                        )}
                      </Button>
                    </Card>
                  )}
                </motion.div>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No documents found in this workspace
                </p>
                <Button
                  onClick={handleCreateDocument}
                  disabled={isCreatingDoc}
                  className="mx-auto"
                >
                  {isCreatingDoc ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Document
                    </>
                  )}
                </Button>
              </Card>
            )}
          </div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
