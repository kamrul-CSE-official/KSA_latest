"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Workspace from "../_components/Workspace";

const floatingBubbleVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

function WorkspacePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-teal-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-5">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-pink-200 to-purple-300 opacity-20 blur-3xl dark:from-pink-900 dark:to-purple-900"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-gradient-to-r from-teal-200 to-cyan-300 opacity-20 blur-3xl dark:from-teal-900 dark:to-cyan-900"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-200 to-indigo-300 opacity-10 blur-3xl dark:from-sky-900 dark:to-indigo-900"></div>
      </div>

      {/* Floating bubbles */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-16 w-16 rounded-full bg-gradient-to-r from-pink-200 to-purple-300 opacity-30 dark:from-pink-800 dark:to-purple-800"
        variants={floatingBubbleVariants}
        animate="animate"
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-12 w-12 rounded-full bg-gradient-to-r from-teal-200 to-cyan-300 opacity-30 dark:from-teal-800 dark:to-cyan-800"
        variants={floatingBubbleVariants}
        animate="animate"
        transition={{ delay: 1 }}
      ></motion.div>
      <motion.div
        className="absolute left-1/3 top-2/3 h-8 w-8 rounded-full bg-gradient-to-r from-sky-200 to-indigo-300 opacity-30 dark:from-sky-800 dark:to-indigo-800"
        variants={floatingBubbleVariants}
        animate="animate"
        transition={{ delay: 2 }}
      ></motion.div>

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Link
          href="/dashboard/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
        <Workspace />
      </motion.div>
    </div>
  );
}

export default WorkspacePage;
