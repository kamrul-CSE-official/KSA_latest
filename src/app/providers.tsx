"use client";

import { Toaster } from "sonner";
import { store } from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import IgnoreNestingErrorBoundary from "./IgnoreNestingErrorBoundary ";

function RootProviders({ children }: { children: ReactNode }) {
  return (
    <section suppressHydrationWarning>
      <IgnoreNestingErrorBoundary>
        <Provider store={store}>
          {children}
          <Toaster />
        </Provider>
      </IgnoreNestingErrorBoundary>
    </section>
  );
}

export default RootProviders;
