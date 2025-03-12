"use client";

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
          {children}
          <Toaster />
          <ScrollToTop />
        </Provider>
      </IgnoreNestingErrorBoundary>
    </section>
  );
}

export default RootProviders;
