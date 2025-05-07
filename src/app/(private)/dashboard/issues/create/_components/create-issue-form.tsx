"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import TipTapEditor from "@/components/tiptap-editor";
import TagInput from "@/components/tag-input";

interface CreateIssueFormProps {
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

export default function CreateIssueForm({
  onSubmit,
  isSubmitting,
}: CreateIssueFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    onSubmit({
      title,
      content,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., How to implement authentication in Next.js?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2 prose">
        <Label htmlFor="content">Description</Label>
        <TipTapEditor
          content={content}
          onChange={setContent}
          placeholder="Describe your issue in detail..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="Add tags (e.g., next.js, react, typescript)"
          maxTags={5}
        />
        <p className="text-xs text-muted-foreground">
          Add up to 5 tags to help others find your issue
        </p>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
        >
          {isSubmitting ? "Creating..." : "Create Issue"}
        </Button>
      </div>
    </form>
  );
}
