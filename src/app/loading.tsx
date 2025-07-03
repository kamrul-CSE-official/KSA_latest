"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      <span className="mt-4 text-muted-foreground">Loading...</span>
    </div>
  );
}
