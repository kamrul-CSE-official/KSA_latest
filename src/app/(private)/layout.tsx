"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { setUserData } from "@/redux/features/user/userSlice";
import { getUserInfo } from "@/service/auth.service";
import { PERSONAL_INFO } from "@/constant/storage.key";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useUserDeatilsMutation } from "@/redux/services/userApi";
import Loading from "@/components/shared/Loading";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const isClient = useState(() => true)[0]; 

  const [fetchUserDetails, { isLoading: isUserLoading }] =
    useUserDeatilsMutation();

  const fetchAndStoreUserInfo = useCallback(async () => {
    try {
      const userData = await getUserInfo();

      if (userData?.EmpID) {
        const detailsArray = await fetchUserDetails({
          EmpID: userData.EmpID,
          EMPNO: userData.EmpID,
        }).unwrap();

        const combinedUserDetails = { ...detailsArray[0], ...userData };

        Cookies.set(PERSONAL_INFO, JSON.stringify(combinedUserDetails), {
          expires: 1 / 24,
          secure: true,
        });

        dispatch(setUserData(combinedUserDetails));
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }, [dispatch, fetchUserDetails, router]);

  useEffect(() => {
    fetchAndStoreUserInfo();
  }, [fetchAndStoreUserInfo]);

  if (!isClient) return null; // Fix hydration issue

  if (loading || isUserLoading) return <Loading />;

  return <div suppressHydrationWarning>{children}</div>; 
}
