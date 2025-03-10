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
        // window.location.href = "/dashboard/ideaPosts"
      } else {
        toast.error("Invalid credentials. Please try again!");
      }
    } catch (error: unknown) {  
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorMessage = (error as { data: { message: string } }).data.message;
        toast.error(errorMessage || "Invalid credentials. Please try again!");
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    }
  }

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center min-h-screen space-y-6 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center text-center md:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="border-orange-300 shadow-orange-300 px-4 py-2 hidden lg:block">
          <small className="flex items-center gap-2">
            <Lightbulb size={25} className="text-orange-500" />
            <strong>NATURUB</strong> prioritizes user security, so provide your
            actual credentials with confidence.
          </small>
        </Card>
        <motion.div
          className="mt-4 max-w-xs md:max-w-sm"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/login.jpg" alt="login-img" />
        </motion.div>
      </motion.div>
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Naturub Knowledge Shareing System</CardTitle>
            <CardDescription>Please Login</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your user name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Login <LogInIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          {isError && (
            <CardFooter>
              <Alert variant="destructive" className="w-full">
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
      </motion.div>
    </motion.div>
  );
}
