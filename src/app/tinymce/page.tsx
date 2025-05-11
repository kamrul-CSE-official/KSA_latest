"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useSuggestedPeopleMutation } from "@/redux/services/issuesApi";

interface IUser {
  id: number;
  name: string;
  avatar: string;
}

export default function AdvancedEditor() {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState("");
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
      SearchKey: "A289",
    });
  }, []);

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

  // Setup editor event listeners when the editor is initialized
  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;

    // Add event listener for keydown to detect @ symbol
    editor.on("keydown", (e: any) => {
      if (e.key === "@") {
        // Get cursor position
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
          setMentionQuery((prev) => prev.slice(0, -1));
          if (mentionQuery.length <= 1) {
            setShowMentionList(false);
          }
        } else if (e.key.length === 1 && e.key !== " ") {
          setMentionQuery((prev) => prev + e.key);
        } else if (e.key === "Escape") {
          setShowMentionList(false);
        } else if (e.key === "Enter" && filteredUsers.length > 0) {
          e.preventDefault();
          insertMention(filteredUsers[0]);
        } else if (e.key === " ") {
          setShowMentionList(false);
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault(); // Prevent cursor movement when navigating mention list
        }
      }
    });

    // Add event listener for keyup to capture typed characters after @
    editor.on("keyup", (e: any) => {
      if (
        showMentionList &&
        e.key.length === 1 &&
        e.key !== "@" &&
        e.key !== " "
      ) {
        setMentionQuery((prev) => prev + e.key);
      }
    });

    // Setup hover listeners for mentions
    setupMentionHoverListeners();

    // Also setup listeners when content changes
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

    // Setup hover listeners after inserting a new mention
    setTimeout(setupMentionHoverListeners, 100);
  };

  const setupMentionHoverListeners = () => {
    if (!editorRef.current) return;

    // Use setTimeout to ensure the editor is fully loaded
    setTimeout(() => {
      const editor = editorRef.current;
      const editorBody = editor.getBody();

      // Remove any existing listeners to prevent duplicates
      editor.off("mouseover", handleMentionMouseOver);
      editor.off("mouseout", handleMentionMouseOut);

      // Add new listeners
      editor.on("mouseover", handleMentionMouseOver);
      editor.on("mouseout", handleMentionMouseOut);
    }, 500);
  };

  const handleMentionMouseOver = (e: any) => {
    const target = e.target;

    // Check if we're hovering over a mention element
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
    // Check if we're moving to the hover card itself
    if (e.relatedTarget && e.relatedTarget.closest(".user-hover-card")) {
      return;
    }

    setHoverCard((prev) => ({ ...prev, show: false }));
  };

  const handleSave = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      alert("Content saved to console!");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Advanced TinyMCE Editor</h1>

      <div className="mb-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Content
        </button>
      </div>

      {apiKey ? (
        <div className="relative">
          <Editor
            apiKey={apiKey}
            onInit={handleEditorInit}
            initialValue="<p>This is the initial content of the editor. Try typing @ to mention someone.</p>"
            init={{
              height: 600,
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
              // Table options
              table_toolbar:
                "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tablesplitcells tablemerge",
              // Image options
              image_advtab: true,
              image_title: true,
              automatic_uploads: true,
              file_picker_types: "image",
              // Media embedding
              media_live_embeds: true,
              // Code sample
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
              // Link options
              link_title: false,
              // Custom file picker for images
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
            onEditorChange={(newContent) => setContent(newContent)}
          />

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
                  src={"data:image/jpeg;base64,"+hoverCard.user.avatar || "/placeholder.svg"}
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
        </div>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            TinyMCE API key is missing. Please add your API key to environment
            variables.
          </p>
          <p className="text-yellow-700 mt-2">
            Get a free API key from{" "}
            <a
              href="https://www.tiny.cloud/auth/signup/"
              target="_blank"
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

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Editor Content Preview:</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
