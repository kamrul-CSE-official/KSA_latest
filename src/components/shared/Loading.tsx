"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import loadingAnimation from "../../../public/assets/lottie/loading.json";

// Dynamically import Lottie for client-side only
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <Lottie animationData={loadingAnimation} loop />
    </div>
  );
}
