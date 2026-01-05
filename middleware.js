import { NextResponse } from "next/server";

export function middleware(request) {
  const auth = request.cookies.get("auth");
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicRoutes = [
    "/",        // Home
    "/login",   // Login
    "/register",// Registro
    "/api",     // API
  ];

  const isPublic = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Usuário não logado tentando acessar rota privada
  if (!auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Usuário logado tentando acessar login ou register
  if (auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return NextResponse.next();
}

// Configuração do matcher para todas as rotas exceto _next e favicon
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
