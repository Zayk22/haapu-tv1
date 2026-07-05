import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/movies",
  "/movies/(.*)",
  "/movie/(.*)",
  "/anime",
  "/anime/(.*)",
  "/tv-shows",
  "/kids",
  "/watch/(.*)",
  "/watchlist",
  "/api/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // auth.protect() handles the sign-in redirect internally using
    // Clerk's own session-aware redirect — no manual URL building,
    // no race conditions, no loop.
    await auth.protect();

    const { sessionClaims } = await auth();
    const role = (sessionClaims as any)?.role;

    if (role !== "admin") {
      // Authenticated but not an admin — send to home
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