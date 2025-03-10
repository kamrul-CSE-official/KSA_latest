"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useIdeaInfoMutation } from "@/redux/services/ideaApi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar, Building2, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface IIdea {
  Title: string;
  EnterdOn: string;
  EntImg: string;
  EntName: string;
  EntSec: string;
  EntDep: string;
  IdeaID: number;
}

function IdeaInfo({
  IdeaID,
  setDocCreate,
  docCreate,
}: {
  IdeaID: string;
  docCreate: boolean;
  setDocCreate: any;
}) {
  const [ideaInfo, setIdeaInfo] = useState<IIdea[] | null>(null);
  const [stateKey, setStateKey] = useState(1);
  const [ideaInfoReq, { isLoading }] = useIdeaInfoMutation();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  // setTimeout(() => {
  //   ideaInfoReq({
  //     Status: 0,
  //     IdeaID: IdeaID,
  //   }).then((res) => {
  //     if (res.data) {
  //       console.log("IDEA: ", res.data);
  //       setIdeaInfo(res?.data);
  //       setStateKey(stateKey+1)
  //       window.location.reload();

  //     }
  //   });
  // }, 2000);

  useEffect(() => {
    const fetchIdeaInfo = async () => {
      const res = await ideaInfoReq({
        Status: 0,
        IdeaID: IdeaID,
      });
  
      if (res.data) {
        setIdeaInfo(res.data);
        setStateKey((prevStateKey) => prevStateKey + 1);
      }
    };
  
    // First fetch when the component mounts
    fetchIdeaInfo();
  
    // Refetch after 2 or 3 seconds using setTimeout
    const timeout = setTimeout(() => {
      fetchIdeaInfo();
    }, 3000); 
  
    return () => clearTimeout(timeout);
  }, [IdeaID, ideaInfoReq]); 
  

  if (isLoading && !ideaInfo) {
    return (
      <Card className="overflow-hidden border border-muted/30">
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div key={stateKey}>
      {ideaInfo?.map((idea: IIdea, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {/* <FileText className="h-5 w-5 text-primary" /> */}
                    <img
                      className="h-5 w-5 text-primary"
                      src="/assets/loopdocument.svg"
                      alt="Dic"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-1">{idea?.Title}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(idea?.EnterdOn), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          idea?.EntImg
                            ? `data:image/jpeg;base64,${idea?.EntImg}`
                            : undefined
                        }
                        alt={idea?.EntName}
                      />
                      <AvatarFallback>
                        {idea?.EntName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{idea?.EntName}</span>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Users className="h-3 w-3" />
                    <span>{idea?.EntSec}</span>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Building2 className="h-3 w-3" />
                    <span>{idea?.EntDep}</span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/document?ideaId=${idea?.IdeaID}&workspaceId=${workspaceId}`}
                >
                  <Button className="flex items-center border" variant="ghost">
                    <BookOpen /> Explore
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default IdeaInfo;
