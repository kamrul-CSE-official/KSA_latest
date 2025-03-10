"use client";

import React, { useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetEmpMutation } from "@/redux/services/userApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";

const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);

const ProfilePage = () => {
  const userDataInfo = useSelector((state: RootState) => state.user.userData);
  const [getUserReg, { isLoading, data: userData, error }] =
    useGetEmpMutation();

  useEffect(() => {
    if (userDataInfo?.EmpID) {
      getUserReg({ EmpID: userDataInfo.EmpID, Name: "", Page: 1, Limit: 5 });
    }
  }, [userDataInfo, getUserReg]);

  const user = userData?.[0];

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-500 text-center">
            Error loading profile data. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/50 px-4 sm:px-6"
    >
      <div className="container mx-auto">
        {isLoading ? <ProfileSkeleton /> : <ProfileCard user={user} />}
      </div>
    </motion.div>
  );
};

const ProfileCard = ({ user }: { user: any }) => (
  <MotionCard
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="overflow-hidden border-none shadow-lg"
  >
    <div className="relative h-40 bg-gradient-to-r from-primary/80 to-primary bg-[url('/assets/cover7.jpg')] bg-cover bg-center">
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
        <Avatar className="w-32 h-32 border-4 border-background shadow-md">
          {user?.Image ? (
            <AvatarImage
              src={`data:image/jpeg;base64,${user.Image}`}
              alt={user?.Name || "Profile"}
            />
          ) : (
            <AvatarFallback className="text-4xl bg-primary/10">
              {user?.Name?.charAt(0) || <User className="h-12 w-12" />}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
    <CardHeader className="flex flex-col items-center text-center pt-20 pb-4">
      <CardTitle className="text-3xl font-bold">
        {user?.Name || "Employee Name"}
      </CardTitle>
      <Badge className="text-sm px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30">
        👑 {user?.DesignationName || "Position"}
      </Badge>
    </CardHeader>
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileDetails user={user} />
      </TabsContent>
      <TabsContent value="contact">
        <ContactDetails user={user} />
      </TabsContent>
    </Tabs>
  </MotionCard>
);

const ProfileDetails = ({ user }: { user: any }) => (
  <MotionCardContent
    className="p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <div className="grid gap-6 md:grid-cols-2">
      <ProfileItem
        icon={<User />}
        label="Employee No"
        value={user?.EmpNO}
        delay={0.5}
      />
      <ProfileItem
        icon={<Briefcase />}
        label="Department"
        value={`${user?.DepartmentName} (${user?.SectionName})`}
        delay={0.6}
      />
      <ProfileItem
        icon={<Calendar />}
        label="Joining Date"
        value={(() => {
          try {
            return user?.JoiningDate ? format(new Date(user?.JoiningDate), "MMM do, yyyy") : "Not Available"
          } catch (error) {
            return "Invalid Date"
          }
        })()}
        delay={0.7}
      />
      <ProfileItem
        icon={<Building />}
        label="Company"
        value={user?.Companys?.[0]?.CompanyName || "Not Available"}
        delay={0.8}
      />
    </div>
  </MotionCardContent>
);

const ContactDetails = ({ user }: { user: any }) => (
  <MotionCardContent
    className="p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <div className="grid gap-6 md:grid-cols-2">
      <ProfileItem
        icon={<Mail />}
        label="Email"
        value={user?.EmailNaturub || "Not Available"}
        delay={0.5}
      />
      <ProfileItem
        icon={<Phone />}
        label="Phone"
        value={user?.PhoneNumber || "Not Available"}
        delay={0.6}
      />
      <ProfileItem
        icon={<MapPin />}
        label="Address"
        value={user?.Address || "Not Available"}
        delay={0.7}
      />
    </div>
  </MotionCardContent>
);

const ProfileItem = ({
  icon,
  label,
  value,
  delay,
}: {
  icon: any;
  label: string;
  value: any;
  delay: number;
}) => (
  <motion.div
    suppressHydrationWarning
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
  >
    <div className="mt-0.5 text-primary">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-base font-medium mt-1">{value}</p>
    </div>
  </motion.div>
);

const ProfileSkeleton = () => (
  <Card className="overflow-hidden border-none shadow-lg">
    <Skeleton className="relative h-40 w-full bg-gradient-to-r from-primary/80 to-primary" />
    <CardHeader className="flex flex-col items-center text-center pt-20 pb-4">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-5 w-32" />
    </CardHeader>
  </Card>
);

export default ProfilePage;
