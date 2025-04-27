import React from "react";
import IssueList from "./_components/IssueList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function IssuesPage() {
  return (
    <div>
      <Link
        href="/dashboard/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2">Naturub Community</h1>
      <p className="text-muted-foreground mb-8">
        Create any issues or query, get answers, and help others solve their
        problems
      </p>
      <IssueList />
    </div>
  );
}

export default IssuesPage;
