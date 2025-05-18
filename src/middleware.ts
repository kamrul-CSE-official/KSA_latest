import { NextRequest, NextResponse } from "next/server";
import { AUTH_KEY } from "./constant/storage.key";

const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Normalize trailing slash for consistency
  const normalizedPath = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  const isProtectedRoute = normalizedPath.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(normalizedPath);

  const token = req.cookies.get(AUTH_KEY)?.value;

  // Not authenticated and trying to access a protected route
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  // Authenticated and trying to access a public route
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard/profile", req.nextUrl.origin));
  }

  return NextResponse.next();
}
