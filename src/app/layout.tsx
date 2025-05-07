import React, { ReactNode } from "react";
import RootProviders from "./providers";
import "./globals.css";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      {/* Next.js expects <head> to be outside <body> */}
      <head>
        <title>KSA | Home</title>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body data-new-gr-c-s-check-loaded="14.1209.0" data-gr-ext-installed="">
        <main className="animate-theme-fade">
          <RootProviders>{children}</RootProviders>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
