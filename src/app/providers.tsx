"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { Toaster } from "sonner";
import { store } from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import IgnoreNestingErrorBoundary from "./IgnoreNestingErrorBoundary ";
import ScrollToTop from "@/components/shared/ScrollToTop";

function RootProviders({ children }: { children: ReactNode }) {
  return (
    <section suppressHydrationWarning>
      <IgnoreNestingErrorBoundary>
        <Provider store={store}>
          <ViewTransition>{children}</ViewTransition>
          <Toaster />
          <ScrollToTop />
        </Provider>
      </IgnoreNestingErrorBoundary>
    </section>
  );
}

export default RootProviders;
