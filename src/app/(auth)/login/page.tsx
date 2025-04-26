"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertOctagon, Lightbulb, LogInIcon } from "lucide-react";
import { useLoginMutation } from "@/redux/services/userApi";
import Cookies from "js-cookie";
import { AUTH_KEY } from "@/constant/storage.key";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formSchema = z.object({
  userName: z.string().min(3, "User name must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export default function LoginPage() {
  const [loginUsers, { isLoading, isError }] = useLoginMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userName: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await loginUsers(values).unwrap();

      if (result?.jwtToken) {
        Cookies.set(AUTH_KEY, result.jwtToken, {
          expires: 1 / 24,
          secure: false,
        });

        toast.success("Welcome to Naturub Knowledge Sharing System.");
        router.replace("/dashboard");
      } else {
        toast.error("Invalid credentials. Please try again!");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorMessage = (error as { data: { message: string } }).data
          .message;
        toast.error(errorMessage || "Invalid credentials. Please try again!");
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    }
  }

  // Animation variants
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-teal-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative elements */}
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
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex w-full max-w-6xl flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Left side - Image and tip */}
          <motion.div
            className="flex flex-col items-center text-center md:text-left md:w-1/2"
            variants={itemVariants}
          >
            <motion.div
              className="mb-6 w-full max-w-md"
              variants={itemVariants}
            >
              <Card className="overflow-hidden border-0 bg-white/20 backdrop-blur-lg dark:bg-slate-900/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                      <Lightbulb size={20} className="text-orange-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <strong>NATURUB</strong> prioritizes user security, so
                      provide your actual credentials with confidence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="relative w-full max-w-md"
              variants={itemVariants}
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-xl"></div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/assets/login.png"
                  alt="login-img"
                  className="w-full h-auto rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            className="w-full md:w-1/2 max-w-md"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 via-purple-500 to-teal-400 opacity-20 blur-xl"></div>
              <Card className="relative border-0 bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                    Naturub Knowledge Sharing System
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Please login to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300">
                                User Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your user name"
                                  {...field}
                                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-purple-400 dark:focus:border-purple-400 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300">
                                Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  {...field}
                                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-purple-400 dark:focus:border-purple-400 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              <span className="ml-2">Logging in...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span>Login</span>
                              <LogInIcon className="ml-2 h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
                {isError && (
                  <CardFooter>
                    <Alert
                      variant="destructive"
                      className="w-full bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800"
                    >
                      <AlertOctagon className="h-4 w-4" />
                      <div>
                        <AlertTitle>Oops...</AlertTitle>
                        <AlertDescription>
                          Invalid credentials. Please try again!
                        </AlertDescription>
                      </div>
                    </Alert>
                  </CardFooter>
                )}
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
