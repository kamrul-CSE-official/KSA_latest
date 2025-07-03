"use client";

import {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState } from "@/redux/store";
import { useIssueShareMutation } from "@/redux/services/issuesApi";
import { useGetEmpMutation } from "@/redux/services/userApi";
import { decrypt } from "@/service/encryption";

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

const IssueShare = ({ children }: IssueShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([]);

  const loggedInUser = useSelector((state: RootState) => state.user.userData);
  const searchParams = useSearchParams();
  const issueId = decrypt(searchParams.get("issueId") || "");

  const [issueShareReq, { isLoading }] = useIssueShareMutation();
  const [getSuggestedUsers, { isLoading: isLoadingSuggestions, data: suggestedUsers }] =
    useGetEmpMutation();

  const fetchSharedUsers = useCallback(async () => {
    try {
      const res = await issueShareReq({
        Type: 3,
        PersonID: loggedInUser?.EmpID,
        IssueId: issueId,
        StatusID: 1,
      });

      if (res.data) {
        const uniqueUsers = new Set<string>();
        const users = res.data.reduce((acc: SharedUser[], user: any) => {
          if (!uniqueUsers.has(user.PersonID)) {
            uniqueUsers.add(user.PersonID);
            acc.push({
              EMP_ID: user.PersonID,
              PersonName: user.FULL_NAME,
              ITEM_IMAGE: user.IMAGE,
            });
          }
          return acc;
        }, []);
        setSelectedUsers(users);
      } else {
        toast.error("Failed to fetch shared users");
      }
    } catch (err) {
      toast.error("Error fetching shared users");
    }
  }, [issueShareReq, loggedInUser?.EmpID, issueId]);

  const fetchSuggestedUsers = useCallback(() => {
    if (!loggedInUser) return;

    const { SectionID = "", DepartmentID = "" } = loggedInUser;

    getSuggestedUsers({
      EmpID: "",
      Name: "",
      SectionID,
      DepartmentID,
      Page: 1,
      Limit: 6,
    });
  }, [getSuggestedUsers, loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) return;
    fetchSuggestedUsers();
    fetchSharedUsers();
  }, [loggedInUser, fetchSuggestedUsers, fetchSharedUsers]);

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

  const handleAddUser = async (user: User) => {
    const exists = selectedUsers.some((u) => u.EMP_ID === user.EmpID);

    await issueShareReq({
      Type: 2,
      PersonID: user.EmpID,
      IssueId: issueId,
      StatusID: 1,
    });

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

  const handleRemoveUser = async (user: SharedUser) => {
    await issueShareReq({
      Type: 1,
      PersonID: user.EMP_ID,
      IssueId: issueId,
      StatusID: 1,
    });

    setSelectedUsers((prev) =>
      prev.filter((u) => u.EMP_ID !== user.EMP_ID)
    );
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
                Issue Manage
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full flex flex-col h-full">
          <TabsList className="grid grid-cols-2 border-b px-6 bg-transparent rounded-none">
            <TabsTrigger value="share" className="py-4">
              Share with People
            </TabsTrigger>
            <TabsTrigger value="visibility" className="py-4 hidden">
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
              {/* Suggested Users */}
              <div>
                <h3 className="font-medium mb-3">
                  Suggested People {selectedUsers.length}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {isLoadingSuggestions ? (
                    Array.from({ length: 4 }).map((_, i) => (
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
                          <Button size="sm" variant="outline" className="shrink-0">
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

              {/* Shared With Section */}
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
                                  <p className="text-sm truncate max-w-[100px]">{user.PersonName}</p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleRemoveUser(user)}
                                  >
                                    <X className="h-4 w-4" />
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

          <TabsContent value="visibility">
            {/* Visibility settings section can go here */}
            <div className="px-6 py-4 text-muted-foreground">
              Coming soon: Manage issue visibility settings.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IssueShare;
