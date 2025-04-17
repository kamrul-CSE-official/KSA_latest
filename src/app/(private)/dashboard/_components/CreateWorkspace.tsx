"use client";

import { memo, type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SmilePlus } from "lucide-react";
import { useCreateWorkspaceMutation } from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "./EmojiPickerComponent";

function CreateWorkspace({ children }: { children: ReactNode }) {
  const [coverImage, setCoverImage] = useState("/assets/cover.png");
  const [workspaceName, setWorkspaceName] = useState("");
  const [emoji, setEmoji] = useState("😀");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error("Workspace name is required.");
      return;
    }

    if (!userData?.EmpID || !userData?.CompanyID) {
      toast.error("User information is missing.");
      return;
    }

    try {
      const response = await createWorkspace({
        Type: 1,
        WorkSpaceName: workspaceName,
        ShareTypeID: 2,
        CompanyID: userData.CompanyID,
        CoverImg: coverImage,
        Emoji: emoji,
        Status: 1,
        EnterdBy: userData.EmpID,
      }).unwrap();

      // console.log("Res: ",response?.[0]?.WorkSpaceID);
      if (response?.[0]?.WorkSpaceID) {
        toast.success("Workspace created successfully!");
        router.push(
          `/dashboard/workspace?workspaceId=${response?.[0]?.WorkSpaceID}`
        );
        setOpen(false);
      } else {
        throw new Error("Failed to create workspace");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to create workspace. Please try again.");
    }
  };

  return (
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
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold">
                Create a workspace
              </DialogTitle>
            </DialogHeader>

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
                  <h2 className="font-semibold text-xl">
                    Create a new workspace
                  </h2>
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
                    placeholder="Workspace Name"
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
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!workspaceName.trim() || isLoading}
                    onClick={handleCreateWorkspace}
                    className="px-5"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        Creating{" "}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateWorkspace);
