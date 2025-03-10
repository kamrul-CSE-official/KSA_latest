import React, { ReactNode, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useWorkspaceListMutation } from "@/redux/services/ideaApi";

function WorkspaceUpdate({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const [workspaceDetailsReq, { isLoading, data }] = useWorkspaceListMutation();

  useEffect(() => {
    workspaceDetailsReq({ Type: 5, WorkSpaceID: workspaceId });
  }, []);

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[800px]">
        <Tabs defaultValue="basic" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
           {/* <img src={data?.} alt="" /> */}
          </TabsContent>
          <TabsContent value="share">
            Change your password here.{" "}
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt
              nostrum esse similique doloremque laudantium vitae consectetur
              tenetur delectus adipisci minus impedit voluptas temporibus sit,
              officiis obcaecati expedita quam incidunt ipsam?
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default WorkspaceUpdate;
