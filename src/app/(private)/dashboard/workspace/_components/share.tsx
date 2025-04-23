"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Lock, Search, Trash, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState } from "@/redux/store";
import {
  useCreateADocumentMutation,
  useWorkspaceShareManageMutation,
} from "@/redux/services/ideaApi";
import { useGetEmpMutation } from "@/redux/services/userApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { decrypt } from "@/service/encryption";

type ShareType = "public" | "private";
type User = {
  EmpID: string;
  Name: string;
  Image: string;
  DesignationName: string;
  Department?: string;
  Section?: string;
};

type SharedUser = {
  EMP_ID: string;
  PersonName: string;
  ITEM_IMAGE: string;
};

const Share = ({
  children,
  setRefreshTrigger,
  refreshTrigger,
}: {
  children: ReactNode;
  refreshTrigger: number;
  setRefreshTrigger: any;
}) => {
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([]);
  const [refreshTriggerShare, setRefreshTriggerShare] = useState(true);
  const [shareType, setShareType] = useState<ShareType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const loggedInUser = useSelector((state: RootState) => state.user.userData);
  const [re, { reset }] = useCreateADocumentMutation();
  const searchParams = useSearchParams();
  const workspaceId = decrypt(searchParams.get("workspaceId") || "");

  const [shareReq, { isLoading: shareLoading, isSuccess: shareSuccess }] =
    useWorkspaceShareManageMutation();
  const [
    requestForSuggestUser,
    { isLoading: suggestPeopleLoading, data: suggestPeopleData },
  ] = useGetEmpMutation();

  const userDetails = useSelector((state: RootState) => state.user.userData);

  // Fetch suggested users on component mount
  useEffect(() => {
    if (loggedInUser?.SectionName || loggedInUser?.SubCostCenter) {
      requestForSuggestUser({
        EmpID: "",
        Name: "",
        SectionID: userDetails?.SectionID || "",
        DepartmentID: userDetails?.DepartmentID || "",
        Page: 1,
        Limit: 6,
      });
      reset();
    }
  }, [loggedInUser, requestForSuggestUser]);

  // Fetch shared users whenever the workspace ID changes or after updates
  useEffect(() => {
    const fetchSharedPersons = async () => {
      if (!workspaceId) return;

      try {
        const req = await shareReq({ Type: 3, WorkSpaceID: workspaceId });
        if (req?.data) {
          setSelectedUsers(req.data);
          reset();
        }
      } catch (error) {
        toast.error("Failed to fetch shared users");
      }
    };

    fetchSharedPersons();
  }, [workspaceId, shareReq, refreshTriggerShare]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    requestForSuggestUser({
      EmpID: isNaN(Number(query)) ? "" : query,
      Name: isNaN(Number(query)) ? query : "",
      SectionID: "",
      DepartmentID: "",
      Page: 1,
      Limit: 6,
    });
  };

  const handleShareTypeChange = async (type: ShareType) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!");
      return;
    }

    setShareType(type);

    try {
      await shareReq({
        Type: 4,
        ShareTypeID: type === "public" ? 1 : 2,
        WorkSpaceID: Number(workspaceId),
      });
      reset();
      toast.success(`Workspace is now ${type}`);
    } catch (error) {
      toast.error(`Failed to set workspace to ${type}`);
    }
  };

  const handleAddUser = async (user: User) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!");
      return;
    }

    try {
      await shareReq({
        Type: 1,
        WorkSpaceID: workspaceId,
        PersonId: user.EmpID,
      });
      reset();
      setRefreshTrigger(refreshTrigger + 1);
      toast.success(`${user.Name} has been added`);
      setRefreshTriggerShare(!refreshTriggerShare);
      setSearchQuery("");
    } catch (error) {
      toast.error(`Failed to add ${user.Name}`);
    }
  };

  const handleRemoveUser = async (user: SharedUser) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!");
      return;
    }

    try {
      await shareReq({
        Type: 2,
        WorkSpaceID: workspaceId,
        PersonId: user.EMP_ID,
      });
      reset();
      setRefreshTrigger(refreshTrigger + 1);
      toast.success(`User has been removed`);
      setRefreshTriggerShare(!refreshTriggerShare);
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-semibold">
                Share Workspace
              </DialogTitle>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full flex flex-col h-full">
          <TabsList className="grid grid-cols-2 rounded-none border-b bg-transparent px-6">
            <TabsTrigger value="share" className="py-4">
              Share with People
            </TabsTrigger>
            <TabsTrigger value="visibility" className="py-4">
              Visibility Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="flex-1 overflow-auto px-6 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Suggested People</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestPeopleLoading ? (
                    Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                  ) : suggestPeopleData?.length ? (
                    suggestPeopleData.map((user: User, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          onClick={() => handleAddUser(user)}
                          className="flex items-center gap-3 p-3 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Avatar className="w-10 h-10 border">
                            <AvatarImage
                              src={`data:image/jpeg;base64,${user.Image}`}
                              alt={user.Name}
                            />
                            <AvatarFallback>
                              {user.Name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.Name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.DesignationName}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="shrink-0"
                            variant="outline"
                          >
                            Add
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground"
                    >
                      <Search className="h-8 w-8" />
                      <p>
                        {searchQuery
                          ? "No results found"
                          : "Search for people to share with"}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t pt-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Shared With</h3>
                    <Badge variant="secondary">
                      {selectedUsers.length} people
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {selectedUsers.map((user: SharedUser, i: number) => (
                        <motion.div
                          key={user.EMP_ID}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          layout
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 border rounded-full pl-2 pr-1 py-1 bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={`data:image/jpeg;base64,${user?.ITEM_IMAGE}`}
                                      alt={user?.PersonName}
                                    />
                                    <AvatarFallback>
                                      {user?.PersonName?.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm truncate max-w-[80px]">
                                    {user?.PersonName}
                                  </span>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveUser(user);
                                    }}
                                    className="h-6 w-6 rounded-full p-0"
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user?.PersonName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="visibility"
            className="flex-1 overflow-auto px-6 py-4"
          >
            <div className="space-y-4">
              <h3 className="font-medium">Workspace Visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Control who can view this workspace
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      shareType === "public"
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleShareTypeChange("public")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Public</h3>
                        <p className="text-sm text-muted-foreground">
                          Anyone in your organization can view this workspace
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      shareType === "private"
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleShareTypeChange("private")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Private</h3>
                        <p className="text-sm text-muted-foreground">
                          Only people you share with can access this workspace
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
