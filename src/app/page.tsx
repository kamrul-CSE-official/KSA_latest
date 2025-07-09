"use client";

import React, { useEffect } from "react";
import LandingSection from "./_components/LandingSection";

function HomePage() {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);

  return (
    <div>
      <LandingSection />
    </div>
  );
}

export default HomePage;
