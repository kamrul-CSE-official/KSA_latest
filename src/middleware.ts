import { NextRequest, NextResponse } from "next/server";
import { AUTH_KEY } from "./constant/storage.key";

const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(pathname);

  // console.log("user info: ", JSON.parse( req.cookies.get(PERSONAL_INFO) ) );

  // Retrieve the auth token from cookies
  const cookie = req.cookies.get(AUTH_KEY)?.value;
  // const userInfo = JSON.parse(req.cookies.get());

  const application: string = "KSA-test";

  // Redirect to login if accessing a protected route without authentication
  if (isProtectedRoute && !cookie && application !== "KSA-test") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing a public route while authenticated
  if (isPublicRoute && cookie) {
    const dashboardUrl = new URL("/dashboard/profile", req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow other requests to proceed
  return NextResponse.next();
}
