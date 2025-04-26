"use client";

import React, { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileWarning, LayoutDashboard, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceList from "./_components/Workspace";
import Items from "./_components/Items";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import IssueList from "./issues/_components/IssueList";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: { opacity: 0, x: -10 },
};

function DashboardPage() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [currentTab, setCurrentTab] = React.useState(
    localStorage.getItem("currentTab") || "workspaces"
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-w-full mx-auto p-4 space-y-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Hi{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {userData?.FullName || "User"}
            </span>
            , welcome back!
          </h1>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full md:w-auto mt-2"
          >
            <TabsList className="grid w-full grid-cols-3 md:flex gap-1 p-1 bg-muted rounded-lg">
              {[
                {
                  value: "issues",
                  icon: <FileWarning className="h-4 w-4" />,
                  label: "Issues",
                },
                {
                  value: "workspaces",
                  icon: <LayoutDashboard className="h-4 w-4" />,
                  label: "Workspaces",
                },
                {
                  value: "ideas",
                  icon: <Lightbulb className="h-4 w-4" />,
                  label: "Ideas",
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() => localStorage.setItem("currentTab", tab.value)}
                  className="relative gap-2 transition-all"
                >
                  <motion.span
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.span>
                  {currentTab === tab.value && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-4"
        >
          {currentTab === "issues" && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Naturub Community</h1>
              <p className="text-muted-foreground mb-8">
                Create any issues or query, get answers, and help others solve
                their problems
              </p>
              <IssueList />
            </div>
          )}

          {currentTab === "workspaces" && (
            <div className="p-6 bg-card rounded-xl shadow-sm border">
              <WorkspaceList />
            </div>
          )}

          {currentTab === "ideas" && (
            <div className="p-6 bg-card rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Your Ideas
              </h2>
              <Items />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(DashboardPage);
