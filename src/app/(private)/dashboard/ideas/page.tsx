import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import Items from "../_components/Items";

function IdeasPage() {
  return (
    <div>
      <Link
        href="/dashboard/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <Items />
    </div>
  );
}

export default IdeasPage;
