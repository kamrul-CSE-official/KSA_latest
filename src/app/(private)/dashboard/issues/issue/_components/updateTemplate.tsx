"use client";

import { useEffect, useRef, useState } from "react";
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

interface UpdateTemplateProps {
    children: React.ReactNode;
    tempId: number;
    setIsUpdateTemp: any;
    isUpdateTemp: number
}

const UpdateTemplate = ({ children, tempId, isUpdateTemp, setIsUpdateTemp }: UpdateTemplateProps) => {
    const editorRef = useRef<any>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<{ title?: string; description?: string; content?: string }>({});
    const [isOpen, setIsOpen] = useState(false);

    const [updateTemplate, { isLoading, data }] = useAboutTemplatesMutation();
    const userDetails = useSelector((state: RootState) => state.user.userData);

    // Fetch current template data when the dialog opens
    useEffect(() => {
        if (isOpen && tempId && userDetails?.EmpID) {
            updateTemplate({
                ID: tempId,
                Type: 2,
                Creator: userDetails.EmpID,
            });
        }
    }, [isOpen, tempId, userDetails?.EmpID, updateTemplate]);

    // Populate form fields with fetched data
    useEffect(() => {
        if (data && data.length > 0 && data[0]?.Title) {
            const fetchedData = data[0];
            setTitle(fetchedData.Title || "");
            setDescription(fetchedData.Description || "");
            setContent(fetchedData.Content || "");

            // Set content for TinyMCE editor if it's initialized
            if (editorRef.current) {
                editorRef.current.setContent(fetchedData.Content || "");
            }
        }
    }, [data]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (e.target.value.trim()) {
            setErrors((prev) => ({ ...prev, title: undefined }));
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        if (e.target.value.trim()) {
            setErrors((prev) => ({ ...prev, description: undefined }));
        }
    };

    const handleEditorChange = (value: string) => {
        setContent(value);
        if (value.trim()) {
            setErrors((prev) => ({ ...prev, content: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) {
            newErrors.title = "Template name is required.";
        }
        if (!description.trim()) {
            newErrors.description = "Description is required.";
        }
        // Ensure TinyMCE editor content is not empty
        const editorContent = editorRef.current?.getContent({ format: "text" })?.trim();
        if (!editorContent) {
            newErrors.content = "Content is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const finalContent = editorRef.current?.getContent();

        try {
            await updateTemplate({
                ID: tempId,
                Title: title.trim(),
                Description: description.trim(),
                Content: finalContent,
                Creator: userDetails?.EmpID,
                Type: 4,
            }).unwrap();

            setIsUpdateTemp(isUpdateTemp + 1);
            toast.success("Template updated successfully!");
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update template:", error);
            toast.error("Something went wrong while updating the template.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[75rem] w-full max-h-[96vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Template</DialogTitle>
                    <DialogDescription className="mb-4">
                        The fields below are pre-filled with the current template. You can make changes and submit.
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
                            onChange={handleTitleChange}
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
                            onChange={handleDescriptionChange}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <Label className="mb-1 block">Content</Label>
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            onInit={(evt, editor) => {
                                editorRef.current = editor;
                                // Set initial content from state, which is populated by fetched data
                                editor.setContent(content || "");
                            }}
                            value={content} // Bind value to state for controlled component
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 400,
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

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Template"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTemplate;