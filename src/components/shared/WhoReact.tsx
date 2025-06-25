"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Lottie from "lottie-react";

// Lottie Animations
import Like from "../../../public/assets/lottie/like.json";
import Dislike from "../../../public/assets/lottie/unlike.json";
import Celebrate from "../../../public/assets/lottie/celebrate.json";
import Support from "../../../public/assets/lottie/support.json";
import Insightful from "../../../public/assets/lottie/insightful.json";
import Appreciate from "../../../public/assets/lottie/Appreciate.json";

const REACTIONS = {
  Like: { label: "Like", animation: Like },
  Dislike: { label: "Dislike", animation: Dislike },
  Celebrate: { label: "Celebrate", animation: Celebrate },
  Support: { label: "Support", animation: Support },
  Insightful: { label: "Insightful", animation: Insightful },
  Appreciate: { label: "Appreciate", animation: Appreciate },
};

type ReactionType = keyof typeof REACTIONS;

type WhoReactProps = {
  children: React.ReactNode;
  title?: string;
  whoLikeData?: {
    ID: string | number;
    USER_ID: string;
    FULL_NAME: string;
    IMAGE?: string;
    LIKES_TYPES: ReactionType;
  }[];
};

function WhoReact({
  children,
  title = "Reactions",
  whoLikeData = [],
}: WhoReactProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator className="my-2" />

        <ScrollArea className="h-64 pr-2">
          <div className="space-y-3">
            {whoLikeData.length > 0 ? (
              whoLikeData.map((user) => (
                <div
                  key={user.ID}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  <Avatar className="h-8 w-8">
                    {user.IMAGE ? (
                      <AvatarImage
                        src={`data:image/jpeg;base64,${user.IMAGE}`}
                        alt={user.FULL_NAME}
                      />
                    ) : (
                      <AvatarFallback>
                        {user.FULL_NAME?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.FULL_NAME} </p>
                  </div>

                  <div className="w-8 h-8"> {/* Increased size */}
                    {REACTIONS[user.LIKES_TYPES] && (
                      <Lottie
                        animationData={REACTIONS[user.LIKES_TYPES].animation}
                        loop={false}
                        autoplay
                        style={{ width: '100%', height: '100%' }} 
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No reactions yet.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default WhoReact;