"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useSuggestedPeopleMutation } from "@/redux/services/issuesApi";



// TinyMCE imports
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";
import "tinymce/skins/ui/oxide/skin.min.css";

interface IUser {
  id: number;
  name: string;
  avatar?: string;
  email?: string;
}

interface TestEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SulationTextEditor({
  content,
  onChange,
  placeholder,
}: TestEditorProps) {
  const editorRef = useRef<any>(null);
  const [mentionQuery, setMentionQuery] = useState("");

  const [reqSuggested, { isLoading, data: suggestedPeople = [] }] =
    useSuggestedPeopleMutation();

  const users: IUser[] = suggestedPeople;
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    if (mentionQuery) {
      reqSuggested({ SearchKey: mentionQuery });
    }
  }, [mentionQuery, reqSuggested]);

  const handleEditorInit = useCallback((evt: any, editor: any) => {
    editorRef.current = editor;

    editor.on("keydown", (e: KeyboardEvent) => {
      if (e.key === "@") {
        e.preventDefault();
        setMentionQuery("");
      }
    });
  }, []);





  const handleImageUpload = (cb: (url: string, meta?: any) => void) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      // Here you would typically upload to your server
      const reader = new FileReader();
      reader.onload = () => {
        cb(reader.result as string, { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  ;

  return (
    <div className="relative rounded-lg border bg-background shadow-sm">
      <Suspense fallback={
        // <Loading className="h-[700px]" />
        <p>Loading...</p>
      }>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onInit={handleEditorInit}
          value={content}
          init={{
            statusbar: false,
            skin: false,
            content_css: false,
            branding: false,
            height: 595,
            menubar: false,
            disabled: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
              "emoticons",
            ],
            toolbar:
              "undo redo | blocks fontfamily | " +
              "bold italic underline strikethrough | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "link image media table | " +
              "removeformat | help",
            content_style: `
              body { 
                font-family: Inter, system-ui, sans-serif; 
                font-size: 14px; 
                line-height: 1.5;
                padding: 12px;
              }
              .mention {
                background: #e0f2fe;
                color: #0369a1;
                border-radius: 4px;
                padding: 0 4px;
                font-weight: 500;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              table, th, td {
                border: 1px solid #e2e8f0;
              }
              th, td {
                padding: 8px 12px;
              }
            `,

            image_advtab: true,
            automatic_uploads: true,
            file_picker_callback: handleImageUpload,
            placeholder: placeholder,
          }}
          onEditorChange={onChange}
        />
      </Suspense>



    </div>
  );
}