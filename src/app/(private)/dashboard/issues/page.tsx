import React from "react";
import Link from "next/link";
import { ArrowLeft, Files } from "lucide-react";
import IssueList from "./_components/IssueList";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="mb-5">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Files className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Explore All Incident</CardTitle>
              <p className="text-blue-100 mt-1">Create any incident or query, get answers, and help others solve their
                problems</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <IssueList />
    </div>
  );
}

export default IssuesPage;
