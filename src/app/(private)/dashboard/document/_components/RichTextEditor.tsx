"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import InlineCode from "@editorjs/inline-code";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
import { toast } from "sonner";
import axios from "axios";
import { imageBaseUrl } from "@/config/envConfig";
import { useIdeaContentUpdateMutation } from "@/redux/services/ideaApi";
import { useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import MentionTool from "./mention/MentionTool";
import { Check, Loader2, Save } from "lucide-react";
import "./mention/mention.css";
import { decrypt } from "@/service/encryption";

interface RichTextEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
}

function RichTextEditor({ initialData, onSave }: RichTextEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [editorReady, setEditorReady] = useState(false);
  const editorInstanceRef = useRef<boolean>(false);
  const initialDataRef = useRef(initialData);

  const searchParams = useSearchParams();
  const workspaceId = decrypt(searchParams.get("workspaceId") || "");
  const ideaId = decrypt(searchParams.get("ideaId") || "");

  const [ideaContentUpdateReq] = useIdeaContentUpdateMutation();

  const saveDocument = useCallback(
    debounce(async () => {
      if (!editorRef.current) return;

      try {
        setSaveStatus("saving");
        const outputData = await editorRef.current.save();

        await ideaContentUpdateReq({
          WorkSpaceID: Number(workspaceId),
          IdeaID: Number(ideaId),
          Content: JSON.stringify(outputData),
        });

        if (onSave) {
          onSave(outputData);
        }

        setSaveStatus("saved");

        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } catch (err) {
        console.error("Error saving document:", err);
        setSaveStatus("error");
        toast.error("Failed to save changes", {
          description: "Your changes will be saved when connection is restored",
          duration: 3000,
        });
      }
    }, 1000),
    [ideaContentUpdateReq, workspaceId, ideaId, onSave]
  );

  const destroyEditor = useCallback(() => {
    saveDocument.cancel();
    if (editorRef.current && typeof editorRef.current.destroy === "function") {
      editorRef.current.destroy();
      editorRef.current = null;
      editorInstanceRef.current = false;
    }
  }, [saveDocument]);

  useEffect(() => {
    return () => {
      destroyEditor();
    };
  }, [destroyEditor]);

  useEffect(() => {
    if (editorRef.current) {
      destroyEditor();
      editorInstanceRef.current = false;
    }

    setTimeout(() => {
      if (!editorInstanceRef.current && initialData) {
        initialDataRef.current = initialData;

        const editor = new EditorJS({
          holder: "editorjs",
          placeholder: "Write your ideas here...",
          autofocus: true,
          data: initialData,
          onChange: () => {
            saveDocument();
          },
          onReady: () => {
            setEditorReady(true);
          },
          tools: {
            header: Header,
            paragraph: Paragraph,
            list: List,
            table: {
              // @ts-ignore
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
                className: "custom-editor-table",
              },
            },
            mention: MentionTool,
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const response = await axios.post(
                        `${imageBaseUrl()}/FileUpload/ImageUpload`,
                        formData,
                        {
                          headers: { "Content-Type": "multipart/form-data" },
                        }
                      );
                      return response.data
                        ? {
                            success: 1,
                            file: {
                              url: `${imageBaseUrl()}/images/${response.data}`,
                            },
                          }
                        : { success: 0 };
                    } catch (error) {
                      console.error("Image upload error:", error);
                      return { success: 0 };
                    }
                  },
                  async uploadByUrl(url: string) {
                    try {
                      const response = await axios.post(
                        `${imageBaseUrl()}/FileUpload/ImageUpload`,
                        { url }
                      );
                      return response.data
                        ? {
                            success: 1,
                            file: {
                              url: `${imageBaseUrl()}/images/${response.data}`,
                            },
                          }
                        : { success: 0 };
                    } catch (error) {
                      console.error("Image upload error:", error);
                      return { success: 0 };
                    }
                  },
                },
              },
            },
            quote: Quote,
            code: CodeTool,
            inlineCode: InlineCode,
          },
        });

        editorRef.current = editor;
        editorInstanceRef.current = true;
      }
    }, 50);
  }, [initialData, destroyEditor, saveDocument]);

  useEffect(() => {
    return () => {
      destroyEditor();
    };
  }, [destroyEditor]);

  return (
    <div className="relative rounded-md overflow-x-hidden">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm overflow-x-hidden">
        {saveStatus === "saving" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Saving...</span>
          </>
        )}
        {saveStatus === "saved" && (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-green-500">Saved</span>
          </>
        )}
        {saveStatus === "error" && (
          <>
            <Save className="h-4 w-4 text-red-500" />
            <span className="text-red-500">Retry saving...</span>
          </>
        )}
      </div>
      <div id="editorjs" className="p-4 min-h-[300px]"></div>
    </div>
  );
}

export default memo(RichTextEditor, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.initialData) ===
    JSON.stringify(nextProps.initialData)
  );
});
