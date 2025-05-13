"use client";

import { useEffect, useState, type ReactNode, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState } from "@/redux/store";
import { useWorkspaceShareManageMutation } from "@/redux/services/ideaApi";
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

interface IssueShareProps {
  children: ReactNode;
  refreshTrigger: number;
  setRefreshTrigger: (val: number) => void;
}

const IssueShare = ({
  children,
  refreshTrigger,
  setRefreshTrigger,
}: IssueShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([]);

  const loggedInUser = useSelector((state: RootState) => state.user.userData);
  const searchParams = useSearchParams();
  const workspaceId = decrypt(searchParams.get("issueId") || "");

  const [shareWorkspace, { isLoading: isSharing }] =
    useWorkspaceShareManageMutation();
  const [
    getSuggestedUsers,
    { isLoading: isLoadingSuggestions, data: suggestedUsers },
  ] = useGetEmpMutation();

  const fetchSuggestedUsers = useCallback(() => {
    if (loggedInUser?.SectionID || loggedInUser?.DepartmentID) {
      getSuggestedUsers({
        EmpID: "",
        Name: "",
        SectionID: loggedInUser?.SectionID || "",
        DepartmentID: loggedInUser?.DepartmentID || "",
        Page: 1,
        Limit: 6,
      });
    }
  }, [loggedInUser, getSuggestedUsers]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [loggedInUser, fetchSuggestedUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    getSuggestedUsers({
      EmpID: isNaN(Number(query)) ? "" : query,
      Name: isNaN(Number(query)) ? query : "",
      SectionID: "",
      DepartmentID: "",
      Page: 1,
      Limit: 6,
    });
  };

  const handleAddUser = (user: User) => {
    const exists = selectedUsers.some((u) => u.EMP_ID === user.EmpID);
    if (!exists) {
      setSelectedUsers((prev) => [
        ...prev,
        {
          EMP_ID: user.EmpID,
          PersonName: user.Name,
          ITEM_IMAGE: user.Image,
        },
      ]);
    }
  };

  const handleRemoveUser = (user: SharedUser) => {
    setSelectedUsers((prev) => prev.filter((u) => u.EMP_ID !== user.EMP_ID));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-semibold">
                Issue manage
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full flex flex-col h-full">
          <TabsList className="grid grid-cols-2 border-b px-6 bg-transparent rounded-none">
            <TabsTrigger value="share" className="py-4">
              Share with People
            </TabsTrigger>
            <TabsTrigger value="visibility" className="py-4">
              Visibility Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="flex-1 overflow-auto px-6 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  {isLoadingSuggestions ? (
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
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                  ) : suggestedUsers?.length ? (
                    suggestedUsers.map((user: User, i: number) => (
                      <motion.div
                        key={user.EmpID}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          onClick={() => handleAddUser(user)}
                          className="flex items-center gap-3 p-3 border rounded-lg shadow-sm cursor-pointer hover:bg-muted transition"
                        >
                          <Avatar className="w-10 h-10 border">
                            <AvatarImage
                              src={`data:image/jpeg;base64,${user.Image}`}
                              alt={user.Name}
                            />
                            <AvatarFallback>
                              {user.Name.slice(0, 2)}
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
                            variant="outline"
                            className="shrink-0"
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
                      className="col-span-2 py-8 flex flex-col items-center gap-2 text-muted-foreground"
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
                      {selectedUsers.map((user) => (
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
                                      src={`data:image/jpeg;base64,${user.ITEM_IMAGE}`}
                                      alt={user.PersonName}
                                    />
                                    <AvatarFallback>
                                      {user.PersonName.slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm truncate max-w-[80px]">
                                    {user.PersonName}
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
                                <p>{user.PersonName}</p>
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
            {/* Visibility Settings content goes here */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IssueShare;
