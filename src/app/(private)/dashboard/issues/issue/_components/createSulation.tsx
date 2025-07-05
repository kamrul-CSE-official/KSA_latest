"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateSelector from "./TemplateSelector";
import SulationTextEditor from "./sulationTextEditor";
import { useIssuesSolutionsMutation } from "@/redux/services/issuesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { decrypt } from "@/service/encryption";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type CreateSulationProps = {
    state: number;
    leftNavState: number;
    setLeftNavState: (index: number) => void;
    updateSulation: number;
    setUpdateSulation: (index: number) => void;
};

const headingMap: Record<number, string> = {
    5: "Add Root Cause",
    6: "Add Assumption",
    7: "Add Claim",
    8: "Add Opinion",
};

const CreateSulation = ({ state, leftNavState, setLeftNavState, updateSulation, setUpdateSulation }: CreateSulationProps) => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<{ title?: string; summary?: string }>({});
    const [reqForSolution, { isLoading: solutionLoading }] = useIssuesSolutionsMutation();

    const userDataInfo = useSelector((state: RootState) => state.user.userData);
    const searchParams = useSearchParams();
    const issueId = decrypt(searchParams?.get("issueId") || "") || "";

    const handleSelectTemplate = (templateContent: string) => {
        setContent(templateContent);
    };

    const handleChange = (field: "title" | "summary", value: string) => {
        if (field === "title") {
            setTitle(value);
        } else if (field === "summary") {
            setSummary(value);
        }
    };

    const handleBlur = (field: "title" | "summary") => {
        if (field === "title" && !title.trim()) {
            setErrors((prev) => ({ ...prev, title: "Title is required." }));
        } else if (field === "summary" && !summary.trim()) {
            setErrors((prev) => ({ ...prev, summary: "Summary is required." }));
        } else {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async () => {
        const isTitleValid = !!title.trim();
        const isSummaryValid = !!summary.trim();

        if (!isTitleValid || !isSummaryValid) {
            setErrors({
                title: isTitleValid ? undefined : "Title is required.",
                summary: isSummaryValid ? undefined : "Summary is required.",
            });
            return;
        }



        await reqForSolution({
            ISSUES_ID: issueId,
            Type: 3,
            USER_ID: userDataInfo?.EmpID,
            TITLE: title,
            CONTENT: content,
            COMPANY_ID: userDataInfo?.CompanyID,
            Summary: summary,
            STATUS: leftNavState
        }).then((res) => {


            if (res?.data[0]?.ISSUES_ID && res?.data[0]?.TITLE) {

                setLeftNavState(0);
                setUpdateSulation(updateSulation + 1);
            }
        });



    };



    return (
        <div className="space-y-6">
            <h1 className="text-5xl font-bold">{headingMap[state] ?? "Add Conclusion"}</h1>

            {/* Title */}
            <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-semibold text-slate-700">
                    Title * 
                </Label>
                <Input
                    type="text"
                    id="title"
                    value={title}
                    placeholder="Provide a title..."
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("title", e.target.value)}
                    onBlur={() => handleBlur("title")}
                    className={`w-full px-3 py-2 border rounded-md text-base ${errors.title ? "border-red-300 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200"
                        }`}
                    required
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Summary */}
            <div className="space-y-3">
                <Label htmlFor="summary" className="text-lg font-semibold text-slate-700">
                    Quick Summary *
                </Label>
                <Textarea
                    id="summary"
                    value={summary}
                    placeholder="Provide a brief summary of your issue..."
                    onChange={(e) => handleChange("summary", e.target.value)}
                    onBlur={() => handleBlur("summary")}
                    className={`min-h-[100px] ${errors.summary ? "border-red-300 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200"
                        }`}
                    required
                />
                {errors.summary && <p className="text-sm text-red-500">{errors.summary}</p>}
            </div>

            {/* Templates */}
            <div className="space-y-3">
                <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Quick Templates
                </Label>
                <TemplateSelector onSelectTemplate={handleSelectTemplate} />
            </div>

            {/* Editor */}
            <SulationTextEditor
                content={content}
                onChange={(value: string) => setContent(value)}
                placeholder="Describe your issue in detail..."
            />

            {/* Submit */}
            <div className="pt-4">
                <Button onClick={handleSubmit} disabled={solutionLoading}>
                    {solutionLoading ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    );
};


export default CreateSulation;