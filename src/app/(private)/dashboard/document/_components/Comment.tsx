"use client";

import React, { memo, ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommentSendMutation } from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSearchParams } from "next/navigation";

interface ICommentData {
  Type: number;
  EmpID: number;
  CommentText: string;
  IdeaID: number;
}

function Comment({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("ideaId");

  const [comment, setComment] = useState("");

  const [commentSend, { isLoading, data, error }] = useCommentSendMutation();
  const { userData } = useSelector((state: RootState) => state.user);

  // Fetch comments on ideaId change (only once on load)
  useEffect(() => {
    if (ideaId) {
      commentSend({
        Type: 2, // Fetch existing comments
        IdeaID: Number(ideaId),
      });
    }
  }, [ideaId, commentSend]);

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    // Submit new comment
    commentSend({
      Type: 1, // Type 1 for sending a new comment
      EmpID: userData?.EmpID,
      CommentText: comment.trim(),
      IdeaID: Number(ideaId),
    }).finally(() => {
      // After submitting, fetch updated comments
      commentSend({
        Type: 2,
        IdeaID: Number(ideaId),
      });
    });

    setComment(""); // Clear comment input
  };

  if (error) {
    toast.error("Failed to submit comment");
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[900px]">
        <DialogHeader>
          <DialogTitle>Leave a Comment</DialogTitle>
          <DialogDescription>
            Share your thoughts or feedback below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            placeholder="Write your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[150px]"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleCommentSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
        <h4>Total comment {data ? data.length : 0}</h4>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-4">
          {/* Render comments */}
          {data?.map((comm: any, i: number) => (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={`data:image/jpeg;base64,${comm?.Img}`} />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="font-bold">{comm?.Name}</h2>
                  <small className="text-sm text-gray-500">
                    {comm?.Section}
                  </small>
                </div>
              </div>
              <p className="mt-2">{comm?.CommentText}</p>
              <small className="font-bold text-xs">{comm?.CreatedAt}</small>
            </div>
          ))}
          {isLoading && (
            <p className="text-center text-gray-500">Loading comments...</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default memo(Comment);
