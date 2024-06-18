import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRouted = createRouteMatcher(["/"]);

export default clerkMiddleware(
  (auth, req) => {
    const _auth = auth();

    // if (isPublicRouted(req) && !_auth.userId) {
    //   return;
    // }

    //     if (!_auth.userId && !isPublicRouted(req)) {
    //       const login = new URL("/", req.url);
    //
    //       return NextResponse.redirect(login);
    //     }

    if (_auth.userId && isPublicRouted(req)) {
      let path = "/select-org";

      if (_auth.orgId) {
        path = `/organization/${_auth.orgId}`;
      }

      const orgSelection = new URL(path, req.url);

      return NextResponse.redirect(orgSelection);
    }

    if (
      _auth.userId &&
      !_auth.orgId &&
      req.nextUrl.pathname !== "/select-org"
    ) {
      const orgSelection = new URL("/select-org", req.url);

      return NextResponse.redirect(orgSelection);
    }
  },
  {
    afterSignInUrl: "/organization",
    afterSignUpUrl: "/organization",
  }
);

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next).*)",
    "/(api|trpc)(.*)",
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
