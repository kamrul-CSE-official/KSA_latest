"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useSuggestedPeopleMutation } from "@/redux/services/issuesApi";
import Loading from "@/components/shared/Loading";

interface IUser {
  id: number;
  name: string;
  avatar: string;
}

interface TestEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TestEditor({
  content,
  onChange,
  placeholder,
}: TestEditorProps) {
  const editorRef = useRef<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [showMentionList, setShowMentionList] = useState<boolean>(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionQuery, setMentionQuery] = useState<string>("");
  const [hoverCard, setHoverCard] = useState<{
    show: boolean;
    user: IUser | null;
    position: { top: number; left: number };
  }>({
    show: false,
    user: null,
    position: { top: 0, left: 0 },
  });
  const [reqSuggested, { isLoading, data: suggestedPeople = [] }] =
    useSuggestedPeopleMutation();

  useEffect(() => {
    reqSuggested({
      SearchKey: "Rahul",
    });
  }, [mentionQuery, reqSuggested]);

  const users: IUser[] = suggestedPeople;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    setApiKey(
      process.env.NEXT_PUBLIC_TINYMCE_API_KEY ||
        "wd7ukl19edj0tp3ech3492v5k2fkno7nadv9p99njwls04s3"
    );
  }, []);

  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;

    editor.on("keydown", (e: any) => {
      if (e.key === "@") {
        const selection = editor.selection;
        if (!selection) return;

        const range = selection.getRng();
        if (!range) return;

        const rect = range.getBoundingClientRect();

        setMentionPosition({
          top: rect.top + window.scrollY + 20,
          left: rect.left,
        });
        setShowMentionList(true);
        setMentionQuery("");
      } else if (showMentionList) {
        if (e.key === "Backspace") {
          const newQuery = mentionQuery.slice(0, -1);
          setMentionQuery(newQuery);
          if (newQuery.length <= 0) {
            setShowMentionList(false);
          }
        } else if (e.key.length === 1 && e.key !== " ") {
          const newQuery = mentionQuery + e.key;
          setMentionQuery(newQuery);
        } else if (e.key === "Escape") {
          setShowMentionList(false);
        } else if (e.key === "Enter" && filteredUsers.length > 0) {
          e.preventDefault();
          insertMention(filteredUsers[0]);
        } else if (e.key === " ") {
          setShowMentionList(false);
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
        }
      }
    });

    setupMentionHoverListeners();
    editor.on("SetContent", setupMentionHoverListeners);
    editor.on("NodeChange", setupMentionHoverListeners);
  };

  const insertMention = (user: IUser) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.execCommand(
      "mceInsertContent",
      false,
      `<span class="mention" data-user-id="${user.id}" contenteditable="false">
        ${user.name}
      </span>&nbsp;`
    );
    setShowMentionList(false);
    setTimeout(setupMentionHoverListeners, 100);
  };

  const setupMentionHoverListeners = () => {
    if (!editorRef.current) return;

    setTimeout(() => {
      const editor = editorRef.current;
      const editorBody = editor.getBody();

      editor.off("mouseover", handleMentionMouseOver);
      editor.off("mouseout", handleMentionMouseOut);

      editor.on("mouseover", handleMentionMouseOver);
      editor.on("mouseout", handleMentionMouseOut);
    }, 500);
  };

  const handleMentionMouseOver = (e: any) => {
    const target = e.target;

    if (target.className === "mention") {
      const userId = Number.parseInt(target.getAttribute("data-user-id"), 10);
      const user = users.find((u) => u.id === userId);

      if (user) {
        const rect = target.getBoundingClientRect();

        setHoverCard({
          show: true,
          user,
          position: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          },
        });
      }
    }
  };

  const handleMentionMouseOut = (e: any) => {
    if (e.relatedTarget && e.relatedTarget.closest(".user-hover-card")) {
      return;
    }

    setHoverCard((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="relative">
      {apiKey && Editor ? (
        <>
          <Suspense fallback={<Loading />}>
            <Editor
              apiKey={apiKey}
              onInit={handleEditorInit}
              value={content}
              init={{
                height: 400,
                menubar: true,
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
                  "codesample",
                  "textpattern",
                  "tablemerge",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "link image media table emoticons codesample | " +
                  "removeformat help code fullscreen preview",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } " +
                  ".mention { background: #d1e4ff; border-radius: 3px; padding: 0 4px; }",
                table_toolbar:
                  "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tablesplitcells tablemerge",
                image_advtab: true,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                media_live_embeds: true,
                codesample_languages: [
                  { text: "HTML/XML", value: "markup" },
                  { text: "JavaScript", value: "javascript" },
                  { text: "CSS", value: "css" },
                  { text: "PHP", value: "php" },
                  { text: "Ruby", value: "ruby" },
                  { text: "Python", value: "python" },
                  { text: "Java", value: "java" },
                  { text: "C", value: "c" },
                  { text: "C#", value: "csharp" },
                  { text: "C++", value: "cpp" },
                ],
                link_title: false,
                placeholder: placeholder,
                //   @ts-ignore
                file_picker_callback: (cb, value, meta) => {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = () => {
                    const file = input.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      cb(reader.result as string, { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
              }}
              onEditorChange={onChange}
            />
          </Suspense>

          {showMentionList && (
            <div
              className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-50 w-64 max-h-60 overflow-auto"
              style={{
                top: `${mentionPosition.top}px`,
                left: `${mentionPosition.left}px`,
              }}
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => insertMention(user)}
                  >
                    <img
                      src={
                        "data:image/jpeg;base64," + user.avatar ||
                        "/placeholder.svg"
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-2"
                      crossOrigin="anonymous"
                    />
                    <span>{user.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No users found</div>
              )}
            </div>
          )}
          {hoverCard.show && hoverCard.user && (
            <div
              className="user-hover-card absolute bg-white shadow-lg rounded-md border border-gray-200 z-50 p-3 w-64"
              style={{
                top: `${hoverCard.position.top}px`,
                left: `${hoverCard.position.left}px`,
              }}
              onMouseLeave={() =>
                setHoverCard((prev) => ({ ...prev, show: false }))
              }
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    "data:image/jpeg;base64," + hoverCard.user.avatar ||
                    "/placeholder.svg"
                  }
                  alt={hoverCard.user.name}
                  className="w-12 h-12 rounded-full"
                  crossOrigin="anonymous"
                />
                <div>
                  <div className="font-semibold">{hoverCard.user.name}</div>
                  <div className="text-sm text-gray-500">
                    ID: {hoverCard.user.id}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            TinyMCE API key is missing. Please add your API key to environment
            variables.
          </p>
          <p className="text-yellow-700 mt-2">
            Get a free API key from{" "}
            <a
              href="#"
              rel="noopener noreferrer"
              className="underline"
            >
              TinyMCE
            </a>{" "}
            and add it to your <code>.env.local</code> file as{" "}
            <code>NEXT_PUBLIC_TINYMCE_API_KEY=your-api-key</code>
          </p>
        </div>
      )}
    </div>
  );
}
