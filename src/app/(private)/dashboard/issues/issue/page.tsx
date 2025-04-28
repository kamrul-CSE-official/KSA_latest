"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockIssues } from "@/lib/mock-data";
import type { Issue } from "@/types/globelTypes";
import IssueDetail from "../_components/issue-detail";
import { decrypt } from "@/service/encryption";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function IssuePage() {
  const searchParams = useSearchParams();
  const issueId = decrypt(searchParams?.get("issueId") || "") || "";
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const currentIssueId = issueId as string;
    const foundIssue = mockIssues.find((i) => i.id === currentIssueId);
    setIssue(foundIssue || null);
    setLoading(false);
  }, [issueId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-8"></div>
        <div className="h-32 bg-muted animate-pulse rounded mb-8"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="px-4">
        <Link
          href="/dashboard/issues"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
        <h1
          data-view-transition-name="page-title"
          className="text-2xl font-bold mb-4"
        >
          Issue not found
        </h1>
        <p>The issue you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <IssueDetail issue={issue} />
    </div>
  );
}
