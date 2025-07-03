"use client";

import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAboutTemplatesMutation } from "@/redux/services/issuesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CreateTemplate = ({ children, isUpdateTemp, setIsUpdateTemp }: { children: React.ReactNode, setIsUpdateTemp: any, isUpdateTemp: number }) => {

    const editorRef = useRef<any>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const [errors, setErrors] = useState<{ title?: string; description?: string; content?: string }>({});
    const [reqTemp, { isLoading }] = useAboutTemplatesMutation();
    const userDetails = useSelector((state: RootState) => state.user.userData);

    const handleEditorChange = (value: string) => {
        setContent(value);
        if (value.trim()) setErrors((prev) => ({ ...prev, content: undefined }));
    };

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) newErrors.title = "Template name is required.";
        if (!description.trim()) newErrors.description = "Description is required.";
        const editorContent = editorRef.current?.getContent({ format: "text" })?.trim();
        if (!editorContent) newErrors.content = "Content is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const finalContent = editorRef.current?.getContent();

        try {
            await reqTemp({
                Content: finalContent,
                Title: title.trim(),
                Description: description.trim(),
                Creator: userDetails?.EmpID,
                Type: 1,
                ID: userDetails?.EmpID,
            }).unwrap();

            toast.success("Template submitted successfully!");
            setTitle("");
            setDescription("");
            setContent("");
            editorRef.current?.setContent("");
            setIsUpdateTemp(isUpdateTemp + 1);
        } catch (error) {
            toast.error("Something went wrong while submitting.");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[75rem] w-full max-h-[96vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Template</DialogTitle>
                    <DialogDescription className="mb-4">
                        Fill in your template content below. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Template Name</Label>
                        <Input
                            id="title"
                            placeholder="Enter template name"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: undefined }));
                            }}
                        />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Short description about the template"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, description: undefined }));
                            }}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <Label className="mb-1 block">Content</Label>
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            onInit={(evt, editor) => (editorRef.current = editor)}
                            value={content}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 350,
                                menubar: false,
                                skin: false,
                                content_css: false,
                                branding: false,
                                statusbar: false,
                                plugins: [
                                    "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                    "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                    "insertdatetime", "media", "table", "help", "wordcount", "emoticons"
                                ],
                                toolbar:
                                    "undo redo | blocks fontfamily | bold italic underline strikethrough | " +
                                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                                    "link image media table | removeformat | help",
                                content_style: `
                  body {
                    font-family: Inter, system-ui, sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    padding: 12px;
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
                            }}
                        />
                        {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Template"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTemplate;
