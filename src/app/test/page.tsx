"use client";

import {
  lazy,
  memo,
  Suspense,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";

// API Hooks
import {
  useCommentSendMutation,
  useGetIdeaDetailsMutation,
  useIdeaShareManageMutation,
} from "@/redux/services/ideaApi";
import type { RootState } from "@/redux/store";

// Utilities
import { getBaseUrl } from "@/config/envConfig";

// Components
import { MessageCircle, Loader2, Logs } from "lucide-react";
import DocumentInfo from "./_components/DocumentInfo";
import Comment from "./_components/Comment";
import template from "./_components/templates.json";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AIGenerateDialog from "./_components/AIGenerateDialog";
import TemplateSelector from "./_components/TemplateSelector";
import SharedUsers from "./_components/SharedUsers";

// Types
interface IIdea {
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

// Constants
const DEFAULT_EDITOR_CONTENT = {
  id: "blank-page",
  name: "Blank Page",
  template:
    '<div style="min-height: 100vh; background-color: #f9fafb; padding: 2rem;"></div>',
};

// Lazy Components
const RichTextEditor = lazy(() => import("./_components/RichTextEditor"));

function DocumentEditor() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const ideaId = searchParams.get("ideaId");

  // State
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [documentData, setDocumentData] = useState<IIdea | null>(null);
  const [initialData, setInitialData] = useState<string>("");
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [tempOpen, setTempOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redux
  const userDetails = useSelector((state: RootState) => state.user.userData);

  // API hooks
  const [getIdeaDetailsReq] = useGetIdeaDetailsMutation();
  const [commentReq, { isLoading: isLoadingComments, data: commentData }] =
    useCommentSendMutation();
  const [shareReq, { data: sharedPeople }] = useIdeaShareManageMutation();

  // Derived values
  const canShareDocument = useMemo(
    () => Number(userDetails?.EmpID) === Number(documentData?.EnterdBy),
    [userDetails?.EmpID, documentData?.EnterdBy]
  );

  // Data fetching
  const fetchDocumentData = useCallback(async () => {
    if (!workspaceId || !ideaId) return;

    setIsLoadingDocument(true);

    try {
      const req: any = await getIdeaDetailsReq({
        WorkSpaceID: workspaceId,
        IdeaID: ideaId,
      });

      if (req?.data?.[0]) {
        setDocumentData(req.data[0]);
        setInitialData(req.data[0]?.Content || DEFAULT_EDITOR_CONTENT.template);
      }
    } catch (error) {
      console.error("Error fetching idea details:", error);
      setInitialData(DEFAULT_EDITOR_CONTENT.template);
    } finally {
      setIsLoadingDocument(false);
    }
  }, [workspaceId, ideaId, getIdeaDetailsReq]);

  const fetchSharedData = useCallback(() => {
    if (ideaId) {
      shareReq({ Type: 3, IdeaID: ideaId });
      commentReq({ Type: 2, IdeaID: Number(ideaId) });
    }
  }, [ideaId, shareReq, commentReq]);

  // Effects
  useEffect(() => {
    fetchDocumentData();
  }, [fetchDocumentData]);

  useEffect(() => {
    fetchSharedData();
  }, [fetchSharedData, refreshTrigger]);

  // Handlers
  const generateFromAI = useCallback(async (prompt: string) => {
    setAiLoading(true);

    try {
      const fullPrompt = `Generate html template for text editor for ${prompt} with emoji and detailed explanations for each topic. The response should be valid JSON that can be parsed.`;

      const response = await axios.post(
        `${getBaseUrl()}/KSA/GenerateAIPromptAsync?text=${encodeURIComponent(
          fullPrompt
        )}`
      );

      const jsonMatch = response?.data?.match(/```json\s*([\s\S]*?)\s*```/) ||
        response?.data?.match(/```\s*([\s\S]*?)\s*```/) || [
          null,
          response?.data,
        ];

      const parsedContent = (jsonMatch[1] || response?.data).trim();
      setInitialData(parsedContent);
      setAiDialogOpen(false);
    } catch (error) {
      console.error("Error generating from AI:", error);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const handleSaveDocument = useCallback((data: string) => {
    // TODO: Implement save logic
    console.log("Document saved:", data);
  }, []);

  const handleSelectTemplate = useCallback((template: string) => {
    setInitialData(template);
    setTempOpen(false);
  }, []);

  const handleAIGenerateClick = useCallback(() => {
    setAiDialogOpen(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-2">
      <SharedUsers
        sharedPeople={sharedPeople || []}
        currentUser={userDetails}
        onAddUser={canShareDocument}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />

      <Card className="mb-4 shadow-md">
        <CardContent className="p-4">
          <Suspense fallback={<Skeleton className="h-20 w-full" />}>
            <DocumentInfo />
          </Suspense>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-4">
          {isLoadingDocument ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading editor...
                  </span>
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
        {!documentData?.Content && tempOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md mx-auto"
          >
            <TemplateSelector
              templates={template.templates}
              onSelectTemplate={handleSelectTemplate}
              onAIGenerate={handleAIGenerateClick}
              setTempOpen={setTempOpen}
              tempOpen={tempOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!documentData?.Content && (
        <Button
          onClick={() => setTempOpen(!tempOpen)}
          className="fixed bottom-8 right-32 z-40 p-3 flex items-center justify-center rounded-full shadow-lg"
          size="icon"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{tempOpen ? "X" : <Logs />}</TooltipTrigger>
              <TooltipContent>
                <p>Select a template</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      )}

      <Comment>
        <Button
          className="fixed bottom-8 right-20 z-40 p-3 flex items-center justify-center rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-5 h-5" />
          {isLoadingComments ? (
            <Loader2 className="absolute top-0 right-0 h-4 w-4 animate-spin" />
          ) : (
            commentData?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary w-5 h-5 flex items-center justify-center text-xs text-secondary-foreground font-bold rounded-full">
                {commentData.length}
              </span>
            )
          )}
          <span className="sr-only">Comments</span>
        </Button>
      </Comment>

      <AIGenerateDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerate={generateFromAI}
        loading={aiLoading}
      />
    </div>
  );
}

export default memo(DocumentEditor);
