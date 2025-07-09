"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useIssuesSolutionsMutation } from "@/redux/services/issuesApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";

interface UpdateSolutionProps {
    children: ReactNode;
    sulationId: number;
    setIsUpdateSulation: any
}

function UpdateSolution({ children, sulationId, setIsUpdateSulation }: UpdateSolutionProps) {
    const [sulationReq, { data }] = useIssuesSolutionsMutation();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const editorRef = useRef<any>(null);

    useEffect(() => {
        sulationReq({
            ID: sulationId,
            Type: 10,
        });
    }, [sulationId]);

    useEffect(() => {
        if (data?.[0]) {
            setTitle(data[0].TITLE || "");
            setSummary(data[0].Summary || "");
        }
    }, [data]);

    const handleUpdate = async () => {
        const content = editorRef.current?.getContent?.() || "";
        await sulationReq({
            ID: sulationId,
            Type: 11,
            TITLE: title,
            Summary: summary,
            CONTENT: content,
        });
        setIsUpdateSulation((pre: number)=> pre + 1);
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="max-w-[75rem] w-full max-h-[96vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Update Solution #{sulationId} {data?.[0]?.TITLE}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />

                    <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Summary"
                        rows={4}
                    />

                    <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={data?.[0]?.CONTENT || ""}
                        init={{
                            height: 400,
                            menubar: false,
                            skin: false,
                            content_css: false,
                            branding: false,
                            statusbar: false,
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

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleUpdate}>Submit</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateSolution;
