import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    const token = req.cookies.get("token");

    if (!token?.value) {
      // Authentication failed
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", req.nextUrl.href); // Add the original URL as a query parameter
      return NextResponse.redirect(url); // Redirect to login with the original URL as a query parameter
    }
    // if (req.nextUrl.pathname.startsWith("/")) {
    //   return NextResponse.rewrite(new URL("/dashboard", req.url));
    // }

    // Authentication successful, continue to the requested page
    return NextResponse.next();
  } catch (error) {
    // Handle authentication errors
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during authentication." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     */
    "/candidate/(.*)",
    "/user/(.*)",
    "/interview/(.*)",
    "/job/(.*)",
    "/offer/(.*)",
    "/",
    // "/",
  ],
};
