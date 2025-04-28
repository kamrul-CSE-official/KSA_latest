"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateIssueForm from "./_components/create-issue-form";
import { useCreateAIssueMutation } from "@/redux/services/issuesApi";
import { RootState } from "@/redux/store";

interface IssueFormData {
  title: string;
  content: string;
  tags?: string[];
}

export default function CreateIssuePage() {
  const router = useRouter();
  const [createIssue, { isLoading }] = useCreateAIssueMutation();
  const { userData } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (formData: IssueFormData) => {
    try {
      if (!userData) {
        throw new Error("User data not available");
      }

      console.log(formData);

      await createIssue({
        TITLE: formData.title,
        CONTENT: formData.content,
        USER_ID: userData.EmpID,
        COMPANY_ID: userData.CompanyID,
        tags: formData.tags,
      }).unwrap();

      toast.success("Successfully created an issue!");
      router.push("/dashboard/issues");
    } catch (error) {
      console.error("Failed to create issue:", error);
      toast.error("Failed to create issue. Please try again.");
    }
  };

  return (
    <div>
      <h4
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 bg-none cursor-pointer"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </h4>

      <h1
        data-view-transition-name="page-title"
        className="text-3xl font-bold mb-4"
      >
        Create New Issue
      </h1>
      <CreateIssueForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
}
