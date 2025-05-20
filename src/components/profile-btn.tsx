import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUserData } from "@/redux/features/user/userSlice";

export function ProfileButton() {
  const route = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    toast.success(`Good bye, ${userData?.FullName}`);
    logout();
    const dispatch = useDispatch();
    dispatch(setUserData(null));
    route.push("/");
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 pb-0">
        <CardDescription>
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  userData?.ImageBase64
                    ? `data:image/jpeg;base64,${userData.ImageBase64}`
                    : ""
                }
                alt={userData?.FullName || "User"}
              />
              <AvatarFallback>
                {userData?.FullName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                {userData?.FullName || "Guest"}
              </p>
              <small className="text-muted-foreground">
                {userData?.SectionName || "No section"}
              </small>
            </div>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Button
          onClick={() => handleLogout()}
          className="w-full text-sidebar-primary-foreground shadow-none"
          size="sm"
          variant="destructive"
        >
          Logout <LogOut />
        </Button>
      </CardContent>
    </Card>
  );
}
