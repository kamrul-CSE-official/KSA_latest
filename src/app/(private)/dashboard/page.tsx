"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MoveRight, Rocket, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AnimatedNumbers from "react-animated-numbers";
import { useKasDashboardInfoMutation, useNumberOfKsaMutation } from "@/redux/services/issuesApi";
import { useEffect, useState } from "react";

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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

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

export default function DashboardPage() {
  const [numberOfIssues, setNumberOfIssues] = useState<number>(0);
  const [numberOfWorkspace, setNumberOfWorkspace] = useState<number>(0);
  const [numberOfIdea, setNumberOfIdea] = useState<number>(0);
  const [numberOfEmploys, setNumberOfEmploys] = useState<number>(0);
  const { userData } = useSelector((state: RootState) => state.user);
  const [reqForNumber, { isLoading, data }] = useNumberOfKsaMutation();

  const [ksaDashboardReq, { data: dashboard }] = useKasDashboardInfoMutation();

  useEffect(() => {
    ksaDashboardReq({
      EmpID: userData?.EmpID
    })
  }, [ksaDashboardReq, userData]);

  console.log("Daaaaaaaaaaaaaaaaaaa: ", dashboard);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          reqForNumber({ Type: 1 }),
          reqForNumber({ Type: 2 }),
          reqForNumber({ Type: 3 }),
          reqForNumber({ Type: 4 }),
        ]);

        console.log("ALL: ", responses[0].data[0].Total);

        if (responses[0].data) setNumberOfIssues(responses[0].data[0].Total);
        if (responses[1].data) setNumberOfWorkspace(responses[1].data[0].Total);
        if (responses[2].data) setNumberOfIdea(responses[2].data[0].Total);
        if (responses[3].data) setNumberOfEmploys(responses[3].data[0].Total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reqForNumber]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-teal-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1
            data-view-transition-name="page-title"
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent"
          >
            Welcome to Your Workspace
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Manage your knowledge, incident, and team collaborations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl">
          {/* Card 1 */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-xl"></div>
              <Card className="relative bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 border-0 shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">Incident</CardTitle>
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </CardHeader>
                <CardContent className="flex items-center justify-between group">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <strong>{dashboard && dashboard[0].NumberOfIssues}</strong>
                      Incidents
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Total number of incidents
                    </p>
                  </div>
                  <Link href="/dashboard/issues">
                    <Button
                      variant="ghost"
                      className="border border-purple-400 transition-all duration-300 ease-in-out group-hover:border-purple-600 group-hover:text-purple-600"
                    >
                      Explore
                      <MoveRight className="ml-2 transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-purple-600" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 via-purple-500 to-teal-400 opacity-20 blur-xl"></div>
              <Card className="relative bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">
                    Kaizen
                  </CardTitle>
                  <Users className="h-6 w-6 text-teal-500" />
                </CardHeader>
                <CardContent className="flex items-center justify-between group">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <strong>{dashboard && dashboard[0].NumberOfWorkspace}</strong>
                      Kaizens
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Total number of kaizens
                    </p>
                  </div>
                  <Link href="/dashboard/workspaces">
                    <Button
                      variant="ghost"
                      className="border border-teal-400 transition-all duration-300 ease-in-out group-hover:border-teal-600 group-hover:text-teal-600"
                    >
                      Explore
                      <MoveRight className="ml-2 transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-teal-600" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          
        </div>

        {/* Tip Card */}
        <motion.div className="mt-12 w-full max-w-md" variants={itemVariants}>
          <Card className="overflow-hidden border-0 bg-white/20 backdrop-blur-lg dark:bg-slate-900/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                  <Lightbulb size={20} className="text-orange-500" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hi <strong>{userData?.FullName}</strong>, You are very special
                  around <strong>{numberOfEmploys}</strong>+ active employees. We are
                  happy to have you in our team.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
