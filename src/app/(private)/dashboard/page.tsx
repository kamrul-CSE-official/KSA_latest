import React, { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkspaceList from "./_components/Workspace";
import Items from "./_components/Items";

function dashboardPage() {
  return (
    <div className="w-full">
      <Tabs defaultValue="workspaces" className="w-full">
        <TabsList className="flex space-x-4 border-b border-gray-300">
          <TabsTrigger
            value="workspaces"
            className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Workspaces
          </TabsTrigger>
          <TabsTrigger
            value="ideas"
            className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ideas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workspaces" className="mt-4">
          <WorkspaceList />
        </TabsContent>
        <TabsContent value="ideas" className="mt-4 text-sm text-gray-600">
          <Items />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default memo(dashboardPage);
