"use client";
import React, { useEffect } from "react";
import LandingSection from "./_components/LandingSection";
import { useRouter } from "next/navigation"; 
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function HomePage() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userData) {
      router.replace("/dashboard");
    }
  }, [userData, router]);

  return (
    <div>
      <LandingSection />
    </div>
  );
}

export default HomePage;
