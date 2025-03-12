"use client";

import {
  lazy,
  memo,
  type ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  useCommentSendMutation,
  useGetIdeaDetailsMutation,
  useIdeaShareManageMutation,
} from "@/redux/services/ideaApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Briefcase,
  CalendarClock,
  ClipboardList,
  FileText,
  Megaphone,
  MessageCircle,
  Users,
  Loader2,
  PlusCircleIcon,
} from "lucide-react";

import DocumentInfo from "./_components/DocumentInfo";
import Comment from "./_components/Comment";
import template from "./_components/templates.json";
import ShareDoc from "./_components/ShareDoc";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const RichTextEditor = lazy(() => import("./_components/RichTextEditor"));

export interface IIdea {
  $id: string;
  CategoryID: number | null;
  CompanyID: number;
  Content: string | null;
  CoverImg: string;
  CreatedAt: string | null;
  Emoji: string;
  EnterdBy: string;
  EnteredOn: string | null;
  FileName: string | null;
  IdeaCode: string | null;
  IdeaID: number;
  Parent: number | null;
  ShareTypeID: number;
  Status: string | null;
  Title: string;
  UpdateBy: string | null;
  UpdateOn: string | null;
  WorkSpaceID: number;
}

function DocumentEditor() {
  const [getIdeaDetailsReq] = useGetIdeaDetailsMutation();
  const [documentData, setDocumentData] = useState<IIdea | null>(null);
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const ideaId = searchParams.get("ideaId");

  const userDetails = useSelector((state: RootState) => state.user.userData);

  const [commentReq, { isLoading: isLoadingComments, data: commentData }] =
    useCommentSendMutation();
  const [shareReq, { data: sharedPerson }] = useIdeaShareManageMutation();

  useEffect(() => {
    shareReq({ Type: 3, IdeaID: ideaId });
  }, [ideaId]);

  console.log("Shared Person: ", sharedPerson);

  const [savedContent, setSavedContent] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);

  useEffect(() => {
    if (ideaId) {
      commentReq({
        Type: 2,
        IdeaID: Number(ideaId),
      });
    }
  }, [ideaId, commentReq]);

  useEffect(() => {
    const fetchDocumentData = async () => {
      if (workspaceId && ideaId) {
        setIsLoadingDocument(true);
        try {
          const req: any = await getIdeaDetailsReq({
            WorkSpaceID: workspaceId,
            IdeaID: ideaId,
          });

          if (req?.data?.[0]) {
            setDocumentData(req.data[0]);

            if (req.data[0]?.Content !== null) {
              try {
                const parsedContent = JSON.parse(req.data[0].Content);
                setInitialData(parsedContent);
              } catch (error) {
                console.error("Error parsing content:", error);
              }
            } else {
              setInitialData({
                time: Date.now(),
                blocks: [
                  {
                    type: "header",
                    data: {
                      text: "Welcome to the Naturub KSA Text Editor",
                      level: 2,
                    },
                  },
                  {
                    type: "paragraph",
                    data: {
                      text: "Start writing your document here. You can use various formatting tools from the toolbar.",
                    },
                  },
                ],
              });
            }
          }
        } catch (error) {
          console.error("Error fetching idea details:", error);
        } finally {
          setIsLoadingDocument(false);
        }
      }
    };

    fetchDocumentData();
  }, [workspaceId, ideaId, getIdeaDetailsReq]);

  const handleSaveDocument = (data: any) => {
    setSavedContent(data);
  };

  const renderIcon = (iconName: string) => {
    const icons: { [key: string]: ReactNode } = {
      Briefcase: <Briefcase size={16} />,
      CalendarClock: <CalendarClock size={16} />,
      ClipboardList: <ClipboardList size={16} />,
      FileText: <FileText size={16} />,
      Megaphone: <Megaphone size={16} />,
      Users: <Users size={16} />,
    };
    return icons[iconName] || null;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center -space-x-1 overflow-hidden">
        {sharedPerson &&
          sharedPerson?.map((person: any, i: number) => (
            <img
              key={i}
              className="inline-block size-8 rounded-full ring-2 ring-white"
              src={`data:image/jpeg;base64,${person?.ITEM_IMAGE}`}
              alt={person?.PersonName}
            />
          ))}
        <img
          className="inline-block size-8 rounded-full ring-2 ring-white"
          src={"data:image/jpeg;base64," + userDetails?.ImageBase64}
          alt={userDetails?.FullName}
        />
        <ShareDoc>
          <Button size="sm">
            <PlusCircleIcon />
          </Button>
        </ShareDoc>
      </div>
      <Card className="mb-4 shadow-lg">
        <CardContent className="p-2">
          <Suspense fallback={<Skeleton className="h-20 w-full" />}>
            <DocumentInfo />
          </Suspense>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-lg">
        <CardContent className="p-3">
          {isLoadingDocument ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              {initialData && (
                <RichTextEditor
                  key={`editor-${ideaId}`}
                  initialData={initialData}
                  onSave={handleSaveDocument}
                />
              )}
            </Suspense>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {documentData?.Content == null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-wrap gap-3 max-w-md justify-end shadow px-5 mx-auto"
          >
            {template?.templates?.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setInitialData(item.data)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      {renderIcon(item.icon)}
                      <span className="text-sm font-medium hidden sm:inline">
                        {item.name}
                      </span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Comment>
        <Button
          className="fixed bottom-20 right-20 z-40 p-4 flex items-center gap-2 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <MessageCircle className="w-5 h-5" />
          {isLoadingComments ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            commentData?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary w-5 h-5 flex items-center justify-center text-xs text-secondary-foreground font-bold rounded-full">
                {commentData.length}
              </span>
            )
          )}
        </Button>
      </Comment>
    </div>
  );
}

export default memo(DocumentEditor);
