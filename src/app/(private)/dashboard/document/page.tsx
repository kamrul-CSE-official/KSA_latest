"use client";

import {
  lazy,
  memo,
  useEffect,
  useState,
  useRef,
  useMemo,
  Suspense,
  ReactNode,
  useCallback,
} from "react";
const RichTextEditor = lazy(() => import("./_components/RichTextEditor"));

import template from "./_components/templates.json";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarClock,
  ClipboardList,
  FileText,
  Megaphone,
  MessageCircle,
  Users,
} from "lucide-react";
import DocumentInfo from "./_components/DocumentInfo";
import {
  useCommentSendMutation,
  useGetIdeaDetailsMutation,
} from "@/redux/services/ideaApi";
import { useSearchParams } from "next/navigation";
import Comment from "./_components/Comment";
import { toast } from "sonner";

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

  const [commentReq, { isLoading, data: commentData }] =
    useCommentSendMutation();

  const [savedContent, setSavedContent] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>({
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

  // Use a ref to track the previous initialData
  const initialDataRef = useRef(initialData);

  // Fetch comments only once when component mounts
  useEffect(() => {
    if (ideaId) {
      commentReq({
        Type: 2,
        IdeaID: Number(ideaId),
      });
    }
  }, [ideaId, commentReq]);

  // Fetch idea details only when workspaceId or ideaId changes
  useEffect(() => {
    if (workspaceId && ideaId) {
      getIdeaDetailsReq({
        WorkSpaceID: workspaceId,
        IdeaID: ideaId,
      })
        .then((req: any) => {
          if (req?.data?.[0]) {
            setDocumentData(req.data[0]);

            // Only update initialData if Content exists and is different
            if (req.data[0]?.Content !== null) {
              try {
                const parsedContent = JSON.parse(req.data[0].Content);
                if (
                  JSON.stringify(parsedContent) !==
                  JSON.stringify(initialDataRef.current)
                ) {
                  setInitialData(parsedContent);
                  initialDataRef.current = parsedContent; // Update the ref
                }
              } catch (error) {
                console.error("Error parsing content:", error);
              }
            } else if (
              JSON.stringify(initialDataRef.current) !==
              JSON.stringify({
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
              })
            ) {
              // If no content in database, set the default welcome message
              const defaultData = {
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
              };
              setInitialData(defaultData);
              initialDataRef.current = defaultData; // Update the ref
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching idea details:", error);
        });
    }
  }, [workspaceId, ideaId, getIdeaDetailsReq]);

  // Stable function to update saved content
  const updateContent = useCallback((data: any) => {
    setSavedContent(data);
  }, []);

  // Memoize the RichTextEditor component to prevent unnecessary re-renders
  const richTextEditor = useMemo(
    () => (
      <Suspense fallback={<p>Loading editor...</p>}>
        <RichTextEditor
          key={`editor-${ideaId}`}
          initialData={initialData}
          onSave={updateContent}
        />
      </Suspense>
    ),
    [initialData, ideaId, updateContent]
  );

  // Stable function to handle template button clicks
  const handleTemplateClick = useCallback((data: any) => {
    setInitialData(data);
    initialDataRef.current = data; // Update the ref
  }, []);

  return (
    <div className="container mx-auto relative">
      <Suspense fallback={<p>Loading document info...</p>}>
        <DocumentInfo />
      </Suspense>

      {richTextEditor}

      {/* Predefined Templates */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-wrap gap-3">
        {documentData?.Content == null &&
          template?.templates?.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleTemplateClick(item.data)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {renderIcon(item.icon)}
              <span className="text-sm font-medium">{item.name}</span>
            </motion.button>
          ))}
      </div>

      <Comment>
        <Button
          className="bg-green-600 fixed bottom-20 right-20 z-40 p-4 flex items-center gap-2"
          size="lg"
        >
          <MessageCircle className="w-5 h-5" />

          {commentData?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 w-5 h-5 flex items-center justify-center text-xs text-white font-bold rounded-full">
              {commentData.length}
            </span>
          )}
        </Button>
      </Comment>
    </div>
  );
}

const renderIcon = (iconName: string) => {
  const icons: { [key: string]: any | ReactNode } = {
    Briefcase: <Briefcase size={16} />,
    CalendarClock: <CalendarClock size={16} />,
    ClipboardList: <ClipboardList size={16} />,
    FileText: <FileText size={16} />,
    Megaphone: <Megaphone size={16} />,
    Users: <Users size={16} />,
  };
  return icons[iconName] || null;
};

export default memo(DocumentEditor);