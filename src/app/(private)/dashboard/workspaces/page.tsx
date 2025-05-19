"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Workspace from "../_components/Workspace";


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
    <div>
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
