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
import { useSelector } from "react-redux";

import {
  useCommentSendMutation,
  useGetIdeaDetailsMutation,
  useIdeaShareManageMutation,
} from "@/redux/services/ideaApi";
import type { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Briefcase,
  CalendarClock,
  ClipboardList,
  FileText,
  Megaphone,
  MessageCircle,
  Users,
  Loader2,
  PlusCircle,
  Sparkles,
} from "lucide-react";

import DocumentInfo from "./_components/DocumentInfo";
import Comment from "./_components/Comment";
import ShareDoc from "./_components/ShareDoc";
import template from "./_components/templates.json";
import axios from "axios";
import { getBaseUrl } from "@/config/envConfig";

// Lazy load the rich text editor for better performance
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

type Template = {
  name: string;
  icon: string;
  data: any;
};

// Component for the shared users avatars
function SharedUsers({
  sharedPeople,
  currentUser,
  onAddUser,
}: {
  sharedPeople: any;
  currentUser: any;
  onAddUser: boolean;
}) {
  return (
    <div className="w-full flex items-center justify-center mb-2">
      <div className="flex -space-x-2 overflow-hidden mr-2">
        {sharedPeople?.map((person: any, i: number) =>
          currentUser?.ImageBase64 !== person?.ITEM_IMAGE && 
          currentUser?.PersonName !== currentUser?.FullName ? (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="border-2 border-background w-8 h-8">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${person?.ITEM_IMAGE}`}
                      alt={person?.PersonName}
                    />
                    <AvatarFallback>
                      {person?.PersonName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{person?.PersonName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            ""
          )
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="border-2 border-background w-8 h-8">
                <AvatarImage
                  src={
                    currentUser?.ImageBase64
                      ? `data:image/jpeg;base64,${currentUser?.ImageBase64}`
                      : undefined
                  }
                  alt={currentUser?.FullName}
                />
                <AvatarFallback>
                  {currentUser?.FullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentUser?.FullName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Avatar className="border-2 border-background w-8 h-8">
          <AvatarImage
            src={
              currentUser?.ImageBase64
                ? `data:image/jpeg;base64,${currentUser?.ImageBase64}`
                : undefined
            }
            alt={currentUser?.FullName}
          />
          <AvatarFallback>{currentUser?.FullName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <ShareDoc>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          disabled={!onAddUser}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add user</span>
        </Button>
      </ShareDoc>
    </div>
  );
}

// Template selector component
function TemplateSelector({
  templates,
  onSelectTemplate,
  onAIGenerate,
}: {
  templates: Template[];
  onSelectTemplate: (data: any) => void;
  onAIGenerate: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group templates by first word in name
  const groupedTemplates =
    templates?.reduce((acc: Record<string, Template[]>, item: Template) => {
      const category = item.name.split(" ")[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Template[]>) || {};

  const categories = Object.keys(groupedTemplates);

  const renderIcon = (iconName: string): ReactNode => {
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
    <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg backdrop-blur-md p-4 min-w-3xl">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Choose a template to get started
      </h3>

      {/* Category tabs with horizontal scrolling */}
      {categories.length > 0 && (
        <div className="flex overflow-x-auto pb-2 mb-3 gap-2 scrollbar-hide">
          <Button
            onClick={() => {
              setSelectedCategory(null);
              onAIGenerate();
            }}
            size="sm"
            variant="secondary"
            className="flex items-center gap-2 rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gradient-to-r from-blue-50 to-purple-50 active:bg-blue-100 transition-all duration-300 ease-in-out"
          >
            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Generate with AI
            </span>
          </Button>
        </div>
      )}

      {/* Template grid */}
      <div className="flex items-center justify-center gap-5">
        {templates?.map((item: Template, index: number) => (
          <TooltipProvider key={index}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onSelectTemplate(item.data)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3",
                    "bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700",
                    "rounded-lg hover:border-primary/50 hover:shadow-sm",
                    "transition-all duration-200 h-full"
                  )}
                >
                  <div className="text-primary dark:text-primary/90">
                    {renderIcon(item.icon)}
                  </div>
                  <span className="text-xs font-medium text-center line-clamp-2">
                    {item.name}{" "}
                  </span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function AIGenerateDialog({
  open,
  onClose,
  onGenerate,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
  loading: boolean;
}) {
  const [userInput, setUserInput] = useState("");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate AI Template</DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="template-prompt"
                  className="block text-sm font-medium mb-1"
                >
                  What would you like to write about?
                </label>
                <Input
                  id="template-prompt"
                  placeholder="Ex. Project Idea, Meeting Notes, Marketing Plan..."
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={!userInput.trim() || loading}
                  onClick={() => onGenerate(userInput)}
                  className="min-w-[90px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function DocumentEditor() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const ideaId = searchParams.get("ideaId");

  // Dialog state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const userDetails = useSelector((state: RootState) => state.user.userData);

  // State
  const [documentData, setDocumentData] = useState<IIdea | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [savedContent, setSavedContent] = useState<any>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);

  // API hooks
  const [getIdeaDetailsReq] = useGetIdeaDetailsMutation();
  const [commentReq, { isLoading: isLoadingComments, data: commentData }] =
    useCommentSendMutation();
  const [shareReq, { data: sharedPeople }] = useIdeaShareManageMutation();

  // const [askFromAiReq, { data: aiRes }] = useAskFRomAIMutation();

  // Default editor content
  const defaultEditorContent = {
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

  // Fetch shared users
  useEffect(() => {
    if (ideaId) {
      shareReq({ Type: 3, IdeaID: ideaId });
    }
  }, [ideaId, shareReq]);

  // Fetch comments
  useEffect(() => {
    if (ideaId) {
      commentReq({
        Type: 2,
        IdeaID: Number(ideaId),
      });
    }
  }, [ideaId, commentReq]);

  // Fetch document data
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (!workspaceId || !ideaId) return;

      setIsLoadingDocument(true);

      try {
        const req: any = await getIdeaDetailsReq({
          WorkSpaceID: workspaceId,
          IdeaID: ideaId,
        });

        if (req?.data?.[0]) {
          setDocumentData(req.data[0]);

          // Parse content if available
          if (req.data[0]?.Content) {
            try {
              const parsedContent = JSON.parse(req.data[0].Content);
              setInitialData(parsedContent);
            } catch (error) {
              console.error("Error parsing content:", error);
              setInitialData(defaultEditorContent);
            }
          } else {
            setInitialData(defaultEditorContent);
          }
        }
      } catch (error) {
        console.error("Error fetching idea details:", error);
      } finally {
        setIsLoadingDocument(false);
      }
    };

    fetchDocumentData();
  }, [workspaceId, ideaId, getIdeaDetailsReq]);

  const handleSaveDocument = (data: any) => {
    setSavedContent(data);
  };

  const canShareDocument =
    Number(userDetails?.EmpID) === Number(documentData?.EnterdBy);

  const generateFromAI = async (prompt: string) => {
    setAiLoading(true);
    setAiError(null);

    try {
      const fullPrompt = `Generate template for editor.js in JSON format for ${prompt} with emoji and detailed explanations for each topic. The response should be valid JSON that can be parsed.`;

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

      let parsedJSON;
      if (jsonMatch[1]) {
        parsedJSON = JSON.parse(jsonMatch[1].trim());
      } else {
        parsedJSON = JSON.parse(response?.data.trim());
      }

      console.log("Parsed JSON from backend:", parsedJSON);
      setInitialData(parsedJSON);
      setAiDialogOpen(false);
    } catch (error) {
      console.error("Error generating from AI:", error);

      setAiError(
        error instanceof SyntaxError
          ? "Could not parse the AI response. Please try again."
          : "An error occurred while generating content. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Shared users section */}
      <SharedUsers
        sharedPeople={sharedPeople}
        currentUser={userDetails}
        onAddUser={canShareDocument}
      />

      {/* Document info card */}
      <Card className="mb-4 shadow-md">
        <CardContent className="p-4">
          <Suspense fallback={<Skeleton className="h-20 w-full" />}>
            <DocumentInfo />
          </Suspense>
        </CardContent>
      </Card>

      {/* Editor card */}
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

      {/* Template selector */}
      <AnimatePresence>
        {documentData?.Content == null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md mx-auto"
          >
            <TemplateSelector
              templates={template?.templates}
              onSelectTemplate={setInitialData}
              onAIGenerate={() => setAiDialogOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments button */}
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

      {/* AI Generation Dialog */}
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
