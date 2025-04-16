import React, { useState, useEffect } from "react";
import TiptapRichTextEditor from "reactjs-tiptap-editor";
import { BaseKit } from "reactjs-tiptap-editor/extension-bundle";

// Import CSS
import "reactjs-tiptap-editor/style.css";

const extensions = [
  BaseKit.configure({
    // Show placeholder
    placeholder: {
      showOnlyCurrent: true,
    },

    // Character count
    characterCount: {
      limit: 50_000,
    },
  }),
];

interface RichTextEditorProps {
  initialData?: string; // Changed from any to string since editor content is typically string (HTML/JSON)
  onSave?: (data: string) => void; // Also changed to string
  onContentChange?: (data: string) => void; // Added optional change handler
}

function RichTextEditorComponent({ 
  initialData = '', 
  onSave,
  onContentChange 
}: RichTextEditorProps) {
  const [content, setContent] = useState<string>(initialData);

  // Handle initialData changes from parent
  useEffect(() => {
    setContent(initialData);
  }, [initialData]);

  const onChangeContent = (value: string) => {
    setContent(value);
    // Call optional onChange prop if provided
    if (onContentChange) {
      onContentChange(value);
    }
  };

  return (
    <div className="rich-text-editor-container"> {/* Added className for styling */}
      <TiptapRichTextEditor
        output="html" // or "json" depending on your needs
        content={content}
        onChangeContent={onChangeContent}
        extensions={extensions}
      />
    </div>
  );
}

export default RichTextEditorComponent;