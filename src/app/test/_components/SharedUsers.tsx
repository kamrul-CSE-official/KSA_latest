import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle } from "lucide-react";
import { memo } from "react";
import ShareDoc from "./ShareDoc";

interface SharedUser {
  ITEM_IMAGE: string;
  PersonName: string;
}

const SharedUsers = memo(function SharedUsers({
  sharedPeople = [],
  currentUser,
  onAddUser,
  refreshTrigger,
  setRefreshTrigger,
}: {
  sharedPeople?: SharedUser[];
  currentUser: any;
  onAddUser: boolean;
  refreshTrigger: number;
  setRefreshTrigger: (value: number) => void;
}) {
  return (
    <div className="flex items-center mb-2">
      <div className="flex -space-x-2 overflow-hidden mr-2">
        {sharedPeople.map((person, i) => (
          <Avatar key={i} className="border-2 border-background w-8 h-8">
            <AvatarImage
              src={`data:image/jpeg;base64,${person?.ITEM_IMAGE}`}
              alt={person?.PersonName}
            />
            <AvatarFallback>{person?.PersonName?.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        <Avatar className="border-2 border-background w-8 h-8">
          <AvatarImage
            src={
              currentUser?.ImageBase64
                ? `data:image/jpeg;base64,${currentUser?.ImageBase64}`
                : undefined
            }
            alt={currentUser?.FullName}
          />
          <AvatarFallback>{currentUser?.FullName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <ShareDoc
        setRefreshTrigger={setRefreshTrigger}
        refreshTrigger={refreshTrigger}
      >
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          disabled={!onAddUser}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add user</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share someone</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </ShareDoc>
    </div>
  );
});

export default SharedUsers;
