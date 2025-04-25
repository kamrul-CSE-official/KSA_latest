import React from "react";
import IssueList from "./_components/IssueList";

function IssuesPage() {
  return (
    <div>
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
