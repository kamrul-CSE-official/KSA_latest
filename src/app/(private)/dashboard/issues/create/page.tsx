"use client";

import { useState } from "react";
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

      // await createIssue({
      //   TITLE: formData.title,
      //   CONTENT: formData.content,
      //   USER_ID: userData.EmpID,
      //   COMPANY_ID: userData.CompanyID,
      // }).unwrap();

      toast.success("Successfully created an issue!");
      // router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create issue:", error);
      toast.error("Failed to create issue. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Create New Issue</h1>
      <CreateIssueForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
}
