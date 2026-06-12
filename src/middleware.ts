import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes — accessible without authentication
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

// Admin routes — require authentication + admin role
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Check if it's an admin route
  if (isAdminRoute(req)) {
    console.log("=== ADMIN ROUTE ACCESS ===");
    console.log("userId:", userId);
    console.log("sessionClaims:", sessionClaims);
    
    if (!userId) {
      console.log("No userId - redirecting to sign-in");
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // FIXED: Get role directly from sessionClaims (not from metadata)
    const role = (sessionClaims as any)?.role;
    console.log("Extracted role:", role);
    
    if (role !== "admin") {
      console.log(`Role is "${role}" - not admin, redirecting to home`);
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    console.log("Admin access GRANTED");
  }
  
  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};