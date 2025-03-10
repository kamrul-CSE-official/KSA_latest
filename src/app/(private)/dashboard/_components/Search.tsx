"use client";

import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useCreateWorkspaceMutation } from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loading from "@/components/shared/Loading";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce"; // Custom debounce hook

interface IWorkspace {
  WorkSpaceName: string;
  WorkSpaceID: string;
  Emoji: string;
}

function Search({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<IWorkspace[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog open/close
  const router = useRouter();

  const [workspaceSearch] = useCreateWorkspaceMutation();
  const loggedInUser = useSelector((state: RootState) => state.user.userData);

  // Debounce the search query to reduce API calls
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggested workspaces on mount
  useEffect(() => {
    const fetchSuggestedWorkspaces = async () => {
      try {
        setIsLoading(true);
        const response = await workspaceSearch({
          Type: 0,
          CompanyID: loggedInUser?.CompanyID || 1,
          EnterdBy: loggedInUser?.EmpID,
          Page: 1,
          Limit: 6,
        });
        if (response.data) {
          setData(response.data);
        }
      } catch (err) {
        setError("Failed to fetch suggested workspaces.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedWorkspaces();
  }, [workspaceSearch, loggedInUser]);

  // Fetch search results when the debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery) return;

      try {
        setIsLoading(true);
        const response = await workspaceSearch({
          SearchKey: debouncedQuery,
          Type: 4,
          Page: 1,
          Limit: 6,
        });
        if (response.data) {
          setData(response.data);
        }
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, workspaceSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % (data?.length || 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + (data?.length || 1)) % (data?.length || 1));
    } else if (e.key === "Enter" && data?.[selectedIndex]) {
      handleItemClick(data[selectedIndex].WorkSpaceID);
    }
  };

  // Handle item click
  const handleItemClick = (workspaceId: string) => {
    router.push(`/dashboard/workspace?workspaceId=${workspaceId}`);
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <SearchIcon className="w-5 h-5" /> Search
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search..."
          className="mt-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Search workspaces"
        />
        <ScrollArea className="max-h-60 mt-2">
          {isLoading && <Loading />}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {data && data.length > 0 ? (
            <ul role="listbox" aria-label="Search results">
              {data.map((workspace, index) => (
                <li
                  key={workspace.WorkSpaceID}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={cn(
                    "px-4 py-2 rounded-md cursor-pointer transition",
                    selectedIndex === index
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleItemClick(workspace.WorkSpaceID)}
                >
                  {workspace.Emoji} {workspace.WorkSpaceName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm mt-2">
              No results found.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default memo(Search)