"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceListMutation } from "@/redux/services/ideaApi";
import { RootState } from "@/redux/store";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WorkspaceItemList from "./_components/WorkspaceItemList";
import CreateWorkspace from "./_components/CreateWorkspace";

function WorkspaceList() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [workspaceListGet, { isLoading, data: workspaceList }] =
    useWorkspaceListMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 9;

  // Calculate total pages dynamically
  const totalItems = workspaceList?.[0]?.TotalPage || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (userData?.CompanyID) {
      workspaceListGet({
        Type: 0,
        CompanyID: userData.CompanyID,
        EnterdBy: userData.EmpID,
        Page: currentPage,
        Limit: itemsPerPage,
      });
    }
  }, [currentPage, userData, workspaceListGet]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">
          Hello,{" "}
          <Link
            className="text-blue-500 hover:underline"
            href="/dashboard/profile"
          >
            {userData?.FullName}
          </Link>
        </h2>
        <CreateWorkspace>
          <Button>+ New Workspace</Button>
        </CreateWorkspace>
      </div>

      <div className="mt-10 flex justify-between">
        <h2 className="font-medium text-primary">Workspaces</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setLayoutMode("grid")}
            className={layoutMode === "grid" ? "bg-accent" : ""}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setLayoutMode("list")}
            className={layoutMode === "list" ? "bg-accent" : ""}
          >
            <AlignLeft />
          </Button>
        </div>
      </div>

      {/* Skeleton Loading */}
      {isLoading ? (
        <div
          className={`mt-6 grid ${
            layoutMode === "grid" ? "grid-cols-3 gap-4" : "grid-cols-1 gap-2"
          }`}
        >
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-24 ${
                layoutMode === "grid" ? "w-full" : "w-[95%] mx-auto"
              } rounded-lg`}
            />
          ))}
        </div>
      ) : totalItems === 0 || !workspaceList ? (
        <div className="flex flex-col justify-center items-center my-10">
          <img
            src="/assets/workspace.png"
            width={200}
            height={200}
            alt="workspace"
          />
          <h2>Create a new workspace</h2>
          <CreateWorkspace>
            <Button className="my-3">+ New Workspace</Button>
          </CreateWorkspace>
        </div>
      ) : (
        <WorkspaceItemList workspaceList={workspaceList} layoutMode={layoutMode} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;
