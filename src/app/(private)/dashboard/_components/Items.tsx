"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMutation } from "@/redux/services/ideaApi";
import { RootState } from "@/redux/store";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WorkspaceItemList from "./WorkspaceItemList";
import CreateWorkspace from "./CreateWorkspace";
import IdeaItemList from "./IdeaItemList";

function ItemsList() {
  const { userData } = useSelector((state: RootState) => state.user);

  const [
    workspaceDashbordReq,
    { data: itemsData, isLoading: workspaceLoading },
  ] = useDashboardMutation();

  useEffect(() => {
    workspaceDashbordReq({
      Type: 2,
      EmpID: userData?.EmpID,
    });
  }, [userData?.EmpID]);

  console.log("idea::::: ", itemsData);

  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 9;

  // Calculate total pages dynamically
  const totalItems = itemsData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <div className="flex justify-between">
        {/* <h2 className="font-bold text-2xl">
          Hello,{" "}
          <Link
            className="text-blue-500 hover:underline"
            href="/dashboard/profile"
          >
            {userData?.FullName}
          </Link>
        </h2> */}
      </div>

      <div className="flex justify-between">
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
      ) : totalItems === 0 || !itemsData ? (
        <div className="flex flex-col justify-center items-center my-10">
          <img
            src="/assets/workspace.png"
            width={200}
            height={200}
            alt="workspace"
          />
        </div>
      ) : (
        <IdeaItemList ItemsList={itemsData} layoutMode={layoutMode} />
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

export default memo(ItemsList);
