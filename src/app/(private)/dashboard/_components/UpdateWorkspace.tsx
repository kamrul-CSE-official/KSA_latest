"use client";

import { memo, type ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SmilePlus } from "lucide-react";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { IWorkspaceDetails } from "@/types/globelTypes";
import { useRouter, useSearchParams } from "next/navigation";
import { decrypt, encrypt } from "@/service/encryption";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function UpdateWorkspace({
  children,
  workspace,
  setRefreshTrigger,
  refreshTrigger,
}: {
  children: ReactNode;
  workspace: IWorkspaceDetails;
  setRefreshTrigger: any;
  refreshTrigger: number;
}) {
  const [coverImage, setCoverImage] = useState(
    workspace.CoverImg || "/assets/cover.png"
  );
  const [workspaceName, setWorkspaceName] = useState(
    workspace.WorkSpaceName || ""
  );
  const [emoji, setEmoji] = useState(workspace.Emoji || "😀");
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [updateWorkspace, { isLoading }] = useUpdateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: isDeleteLoading }] =
    useDeleteWorkspaceMutation();

  const searchParams = useSearchParams();
  const workspaceId = decrypt(searchParams?.get("workspaceId") || "");

  // Initialize form fields with workspace data when dialog opens
  useEffect(() => {
    if (open) {
      setCoverImage(workspace.CoverImg || "/assets/cover.png");
      setWorkspaceName(workspace.WorkSpaceName || "");
      setEmoji(workspace.Emoji || "😀");
    }
  }, [open, workspace]);

  const handleUpdateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error("KAIZEN name is required.");
      return;
    }

    if (!userData?.EmpID || (!userData?.CompanyID && workspaceId)) {
      toast.error("User information is missing.");
      return;
    }

    const response = await updateWorkspace({
      Type: 6,
      WorkSpaceID: workspaceId,
      WorkSpaceName: workspaceName,
      CoverImg: coverImage,
      Emoji: emoji,
      EnterdBy: userData.EmpID,
    }).unwrap();

    if (response) {
      toast.success("Workspace updated successfully!");
      setOpen(false);
      setRefreshTrigger(refreshTrigger + 1);
      router.push(`/dashboard/workspace/?workspaceId=${encrypt(workspaceId)}`);
    } else {
      toast.error("Failed to update KAIZEN. Please try again.");
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceId) {
      toast.error("KAIZEN ID is missing.");
      return;
    }

    const res = await deleteWorkspace({
      Type: 7,
      WorkSpaceID: workspaceId || 0,
    }).unwrap();

    if (res) {
      toast.success("KAIZEN deleted successfully!");
      setRefreshTrigger(refreshTrigger + 1);
      setDeleteConfirmOpen(false);
      setOpen(false);
      router.push("/dashboard");
    } else {
      toast.error("Failed to delete workspace. Please try again.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[850px] p-0 overflow-hidden">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl w-full overflow-hidden"
            >
              <div className="shadow-lg rounded-xl w-full">
                <CoverPicker setNewCover={setCoverImage}>
                  <motion.div
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white font-medium">Change Cover</span>
                    </motion.div>
                    <motion.img
                      src={coverImage}
                      alt="Workspace Cover"
                      className="w-full h-[180px] object-cover rounded-t-xl transition-all duration-200"
                      layoutId="coverImage"
                    />
                  </motion.div>
                </CoverPicker>

                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <h2 className="font-semibold text-xl">Update workspace</h2>
                    <p className="text-sm mt-2 text-muted-foreground">
                      This is a shared space where you can collaborate with your
                      team. You can always rename it later.
                    </p>
                  </motion.div>

                  <motion.div
                    className="mt-8 flex gap-3 items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <EmojiPickerComponent setEmojiIcon={setEmoji}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <motion.span
                          key={emoji}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="text-lg"
                        >
                          {emoji || <SmilePlus size={20} />}
                        </motion.span>
                      </Button>
                    </EmojiPickerComponent>

                    <Input
                      placeholder="KAIZEN Name"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="h-10 text-base"
                      maxLength={50}
                    />
                  </motion.div>

                  <motion.div
                    className="mt-8 flex justify-end gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Button
                      disabled={!workspaceName.trim() || isLoading}
                      onClick={handleUpdateWorkspace}
                      className="px-5"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          Updating{" "}
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        "Update"
                      )}
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirmOpen(true)}
                      variant="destructive"
                      disabled={isDeleteLoading}
                    >
                      {isDeleteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="px-5"
                      disabled={isLoading || isDeleteLoading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workspace
              and all its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete KAIZEN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default memo(UpdateWorkspace);