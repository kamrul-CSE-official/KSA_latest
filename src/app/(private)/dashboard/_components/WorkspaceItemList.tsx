"use client";

import { memo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { encrypt } from "@/service/encryption";
import { Calendar, Globe, Lock, Users, User, UserPlus, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceShareManageMutation } from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateWorkspace from "./CreateWorkspace";

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

interface SharedUser {
  PersonName: string;
  ITEM_IMAGE: string;
  EMP_ID?: number
}

function WorkspaceItemList({
  workspaceList,
  layoutMode,
}: {
  workspaceList: IWorkspace[];
  layoutMode: "grid" | "list";
}) {
  const router = useRouter();
  const [fetchSharedUsers] = useWorkspaceShareManageMutation();
  const [sharedUsersMap, setSharedUsersMap] = useState<
    Record<number, SharedUser[]>
  >({});
  const [loadingSharedUsers, setLoadingSharedUsers] = useState<
    Record<number, boolean>
  >({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { userData } = useSelector((state: RootState) => state.user);
  const loggedInUserId = userData?.EmpID;

  // Categorize workspaces
  const myWorkspaces = workspaceList.filter(
    (workspace) => workspace.EnterdBy === loggedInUserId
  );
  const sharedWorkspaces = workspaceList.filter(
    (workspace) => workspace.EnterdBy !== loggedInUserId
  );

  // Get workspace counts
  const myWorkspacesCount = myWorkspaces.length;
  const sharedWorkspacesCount = sharedWorkspaces.length;

  const handleWorkspaceClick = useCallback(
    (workspaceId: number) => {
      const encryptedId = encrypt(workspaceId);
      router.push(`/dashboard/workspace?workspaceId=${encryptedId}`);
    },
    [router]
  );

  // Fetch shared users for custom share type workspaces
  useEffect(() => {
    const fetchCustomShareUsers = async () => {
      const customShareWorkspaces = workspaceList.filter(
        (workspace) => workspace.ShareTypeName === "Custom"
      );

      for (const workspace of customShareWorkspaces) {
        if (
          !sharedUsersMap[workspace.WorkSpaceID] &&
          !loadingSharedUsers[workspace.WorkSpaceID]
        ) {
          await fetchSharedUsersForWorkspace(workspace.WorkSpaceID);
        }
      }
    };

    fetchCustomShareUsers();
  }, [workspaceList]);

  const fetchSharedUsersForWorkspace = async (workspaceId: number) => {
    setLoadingSharedUsers((prev) => ({ ...prev, [workspaceId]: true }));

    try {
      const response: any = await fetchSharedUsers({
        Type: 3,
        WorkSpaceID: workspaceId,
      }).unwrap();

      setSharedUsersMap((prev) => ({
        ...prev,
        [workspaceId]: response || [],
      }));
    } catch (error) {
      console.error("Error fetching shared users:", error);
    } finally {
      setLoadingSharedUsers((prev) => ({ ...prev, [workspaceId]: false }));
    }
  };

  const getShareTypeColor = (shareType: string) => {
    switch (shareType) {
      case "Private":
        return {
          bg: "bg-gradient-to-r from-rose-50 to-rose-100",
          text: "text-rose-600",
          icon: "text-rose-500",
          border: "border-rose-200",
        };
      case "Public":
        return {
          bg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
          text: "text-emerald-600",
          icon: "text-emerald-500",
          border: "border-emerald-200",
        };
      case "Custom":
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100",
          text: "text-blue-600",
          icon: "text-blue-500",
          border: "border-blue-200",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-gray-100",
          text: "text-gray-600",
          icon: "text-gray-500",
          border: "border-gray-200",
        };
    }
  };

  const renderShareTypeIndicator = (workspace: IWorkspace) => {
    const colors = getShareTypeColor(workspace.ShareTypeName);

    switch (workspace.ShareTypeName) {
      case "Private":
        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${colors.bg} ${colors.border} backdrop-blur-sm shadow-sm`}
          >
            <Lock size={12} className={colors.icon} />
            <span className={`text-xs font-medium ${colors.text}`}>
              Private
            </span>
          </Badge>
        );
      case "Public":
        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${colors.bg} ${colors.border} backdrop-blur-sm shadow-sm`}
          >
            <Globe size={12} className={colors.icon} />
            <span className={`text-xs font-medium ${colors.text}`}>Public</span>
          </Badge>
        );
      case "Custom":
        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${colors.bg} ${colors.border} backdrop-blur-sm shadow-sm`}
          >
            <Users size={12} className={colors.icon} />
            <span className={`text-xs font-medium ${colors.text}`}>Custom</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderSharedUsers = (workspace: IWorkspace) => {
    if (workspace.ShareTypeName !== "Custom") return null;

    const users = sharedUsersMap[workspace.WorkSpaceID];
    const isLoading = loadingSharedUsers[workspace.WorkSpaceID];

    if (isLoading) {
      return (
        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="w-8 h-8 rounded-full" />
          ))}
        </div>
      );
    }

    if (!users || users.length === 0) {
      return <p className="text-xs text-gray-500 mt-3">No shared users</p>;
    }

    return (
      <div className="flex items-center gap-1 mt-3 flex-wrap">
        {users.slice(0, 5).map((user, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Avatar className="w-8 h-8 border-2 border-white shadow-sm ring-2 ring-gray-50">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${user.ITEM_IMAGE}`}
                      alt={user.PersonName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500">
                      {user.PersonName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.PersonName || "User"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {users.length > 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="rounded-full h-8 w-8 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 border border-indigo-200 shadow-sm"
            >
              +{users.length - 5}
            </Badge>
          </motion.div>
        )}
      </div>
    );
  };

  const getRandomGradient = (id: number) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-orange-500 to-amber-600",
      "from-pink-500 to-rose-600",
      "from-purple-500 to-violet-600",
      "from-cyan-500 to-sky-600",
    ];

    return gradients[id % gradients.length];
  };

  const renderWorkspaceCards = (workspaces: IWorkspace[]) => {
    return (
      <div
        className={`mt-4 ${
          layoutMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-5"
        }`}
      >
        <AnimatePresence>
          {workspaces.map((workspace) => (
            <motion.div
              key={workspace.WorkSpaceID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              onHoverStart={() => setHoveredCard(workspace.WorkSpaceID)}
              onHoverEnd={() => setHoveredCard(null)}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card
                onClick={() => handleWorkspaceClick(workspace.WorkSpaceID)}
                className={`cursor-pointer overflow-hidden border border-white/20 ${
                  layoutMode === "list" ? "flex items-start" : ""
                } group relative bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300`}
                style={{
                  borderRadius: layoutMode === "grid" ? "1rem" : "0.75rem",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-inherit box-border border border-white/10 pointer-events-none"></div>

                {layoutMode === "grid" ? (
                  <>
                    <div className="relative">
                      <div className="h-[160px] overflow-hidden">
                        {workspace.CoverImg ? (
                          <img
                            src={workspace.CoverImg || "/placeholder.svg"}
                            alt="Workspace Cover"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${getRandomGradient(
                              workspace.WorkSpaceID
                            )}`}
                          >
                            <div className="flex items-center justify-center h-full text-6xl/90">
                              {workspace.Emoji || "😊"}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        {renderShareTypeIndicator(workspace)}
                      </div>

                      {workspace.EnterdBy === loggedInUserId && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge
                            variant="outline"
                            className="bg-white/30 border-white/40 backdrop-blur-md shadow-lg flex items-center gap-1"
                          >
                            <User size={12} className="text-white" />
                            <span className="text-xs font-medium">Owner</span>
                          </Badge>
                        </div>
                      )}

                      <motion.div
                        className="absolute bottom-3 left-3 z-10"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity:
                            hoveredCard === workspace.WorkSpaceID ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge
                          variant="outline"
                          className="bg-white/40 backdrop-blur-md shadow-lg border-white/30 flex items-center gap-1.5 py-1.5"
                        >
                          <Calendar size={12} className="text-white" />
                          <span className="text-xs font-medium">
                            {format(
                              new Date(workspace.EnterdOn),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </Badge>
                      </motion.div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">
                          {workspace.Emoji || "😊"}
                        </span>
                        <CardTitle className="text-lg font-semibold truncate">
                          {workspace.WorkSpaceName}
                        </CardTitle>
                      </div>
                      <CardDescription className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 ring-2 ring-white/30">
                            <AvatarImage
                              src={`data:image/png;base64,${workspace.IMAGE}`}
                              alt={workspace.FULL_NAME}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900">
                              {workspace.FULL_NAME?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium truncate">
                            {workspace.FULL_NAME}
                          </p>
                        </div>
                        {renderSharedUsers(workspace)}
                      </CardDescription>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 p-4">
                      {workspace.CoverImg ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-white/20">
                          <img
                            src={workspace.CoverImg || "/placeholder.svg"}
                            alt="Workspace Cover"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${getRandomGradient(
                            workspace.WorkSpaceID
                          )} flex items-center justify-center border border-white/20`}
                        >
                          <span className="text-3xl">
                            {workspace.Emoji || "😊"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <span className="text-2xl">
                              {workspace.Emoji || "😊"}
                            </span>
                            <span>{workspace.WorkSpaceName}</span>
                          </CardTitle>
                          {workspace.EnterdBy === loggedInUserId && (
                            <Badge
                              variant="outline"
                              className="bg-white/30 border-white/40 backdrop-blur-md shadow-lg flex items-center gap-1 ml-2"
                            >
                              <User size={12} className="text-white" />
                              <span className="text-xs font-medium">Owner</span>
                            </Badge>
                          )}
                        </div>
                        {renderShareTypeIndicator(workspace)}
                      </div>

                      <CardDescription className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 ring-2 ring-white/30">
                              <AvatarImage
                                src={`data:image/png;base64,${workspace.IMAGE}`}
                                alt={workspace.FULL_NAME}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900">
                                {workspace.FULL_NAME?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">
                              {workspace.FULL_NAME}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-white/30 border-white/40 backdrop-blur-md shadow-lg flex items-center gap-1.5"
                          >
                            <Calendar size={12} className="text-white" />
                            <span className="text-xs font-medium">
                              {format(
                                new Date(workspace.EnterdOn),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </Badge>
                        </div>
                        {renderSharedUsers(workspace)}
                      </CardDescription>
                    </div>
                  </>
                )}

                {/* Enhanced corner accent */}
                <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 rounded-br-lg bg-gradient-to-br from-white/30 to-transparent backdrop-blur-sm"></div>
                </div>

                {/* Subtle reflection */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>

                {/* Hover shadow */}
                <div className="absolute inset-0 rounded-inherit shadow-[0_0_0_1px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  // If no workspaces, show empty state
  const renderEmptyState = (type: "my" | "shared") => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          {type === "my" ? (
            <User className="h-8 w-8 text-gray-400" />
          ) : (
            <UserPlus className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {type === "my" ? "No workspaces created yet" : "No shared workspaces"}
        </h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          {type === "my"
            ? "Create your first workspace to start organizing your ideas and collaborating with others."
            : "When someone shares a workspace with you, it will appear here."}
        </p>
        {type === "my" && (
          <CreateWorkspace>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 gap-2">
              Create Workspace <Plus />
            </button>
          </CreateWorkspace>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="my" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white/20 border-white/30 backdrop-blur-sm shadow-md border p-1 rounded-2xl">
            <TabsTrigger
              value="all"
              className="px-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Workspaces
              <Badge className="ml-2 bg-muted text-muted-foreground">
                {workspaceList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="my"
              className="px-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Workspaces
              <Badge className="ml-2 bg-muted text-muted-foreground">
                {myWorkspacesCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="px-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Shared With Me
              <Badge className="ml-2 bg-muted text-muted-foreground">
                {sharedWorkspacesCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {workspaceList.length > 0 ? (
            renderWorkspaceCards(workspaceList)
          ) : (
            <EmptyState router={router} />
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-0">
          {myWorkspacesCount > 0
            ? renderWorkspaceCards(myWorkspaces)
            : renderEmptyState("my")}
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          {sharedWorkspacesCount > 0
            ? renderWorkspaceCards(sharedWorkspaces)
            : renderEmptyState("shared")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ router }: { router: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-background/50 backdrop-blur-md border border-border rounded-3xl shadow-sm">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No workspaces available
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Create your first workspace to start organizing your ideas and
        collaborating with others.
      </p>
      <button
        onClick={() => router.push("/dashboard/create-workspace")}
        className="inline-flex items-center px-5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Create Workspace
      </button>
    </div>
  );
}

export default memo(WorkspaceItemList);
