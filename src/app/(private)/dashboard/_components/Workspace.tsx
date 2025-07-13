"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMutation } from "@/redux/services/ideaApi";
import { RootState } from "@/redux/store";
import { AlignLeft, LayoutGrid } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WorkspaceItemList from "./WorkspaceItemList";
import CreateWorkspace from "./CreateWorkspace";

function WorkspaceList() {
  const { userData } = useSelector((state: RootState) => state.user);

  const [
    workspaceDashbordReq,
    { data: workspaceData, isLoading: workspaceLoading },
  ] = useDashboardMutation();

  useEffect(() => {
    workspaceDashbordReq({
      Type: 1,
      EmpID: userData?.EmpID,
    });
  }, [userData?.EmpID]);

  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 9;

  // Calculate total pages dynamically
  const totalItems = workspaceData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <div className="flex justify-between">
        {workspaceData?.length > 0 &&
        workspaceData.filter(
          (workspace: any) => workspace.EnterdBy == userData?.EmpID
        ).length > 0 ? (
          <CreateWorkspace>
            <Button className="mb-4">+ New Kaizen Idea</Button>
          </CreateWorkspace>
        ) : (
          <h2 className="font-medium text-primary">KAIZEN</h2>
        )}
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
      {workspaceLoading ? (
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
      ) : totalItems === 0 || !workspaceData ? (
        <div className="flex flex-col justify-center items-center my-10">
          <img
            src="/assets/workspace.png"
            width={200}
            height={200}
            alt="workspace"
          />
          <h2>Create a new KAIZEN</h2>
          <CreateWorkspace>
            <Button className="my-3">+ New Kaizen Idea</Button>
          </CreateWorkspace>
        </div>
      ) : (
        <WorkspaceItemList
          workspaceList={workspaceData}
          layoutMode={layoutMode}
        />
      )}

      {/* Pagination */}
      {!workspaceLoading && totalPages > 1 && (
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

export default memo(WorkspaceList);
