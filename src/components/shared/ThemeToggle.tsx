"use client";

import React, { useCallback, memo } from "react";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = memo(() => {
  const {
    ref,
    toggleSwitchTheme,
    isDarkMode = true,
  } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 500,
    easing: "ease-in-out",
  });

  const handleToggle = useCallback(() => {
    requestAnimationFrame(() => {
      toggleSwitchTheme();
    });
  }, [toggleSwitchTheme]);

  return (
    <Button
      className="rounded-full p-2"
      size="sm"
      variant="ghost"
      ref={ref}
      onClick={handleToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
