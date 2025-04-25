"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateIssueForm from "./_components/create-issue-form";

export default function CreateIssuePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    console.log(formData);

    // In a real app, this would be an API call to create the issue
    // For now, we'll just simulate a delay and redirect
    setTimeout(() => {
      setIsSubmitting(false);
      //   router.push("/")
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Create New Issue</h1>
      <CreateIssueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
