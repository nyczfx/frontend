import { NextResponse } from "next/server";

export function middleware(request) {
  const auth = request.cookies.get("auth");
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/login",
    "/register",
    "/api",
  ];

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
