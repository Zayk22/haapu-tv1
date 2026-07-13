import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/movies",
  "/movies/(.*)",
  "/movie/(.*)",
  "/tv-shows",
  "/kids",
  "/faq",
  "/privacy",
  "/terms",
  "/api/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // /watch/* is intentionally NOT public
  // Unauthenticated users who click Play are redirected to sign-in
  // Clerk automatically includes the watch URL so they return to the
  // exact movie after signing up/in
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
    const { sessionClaims } = await auth();
    const role = (sessionClaims as any)?.role;
    if (role !== undefined && role !== null && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};