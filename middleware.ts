// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("auth-token")?.value; // token in cookie
//   const token = localStorage.getItem("auth-token")

//   // If user is logged in, block access to /login and /signup
//   if (token && (pathname.startsWith("/login"))) {
//     return NextResponse.redirect(new URL("/dashboard", req.url)); // redirect to homepage or dashboard
//   }

//   if (!token) {
//       // redirect to login if not authenticated
//       const loginUrl = new URL("/login", req.url);
//       return NextResponse.redirect(loginUrl);
//     }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login"], // apply only to these routes
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value; // read auth cookie
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname.startsWith("/login");

  // 1️⃣ If NOT logged in → block every route except /login
  if (!auth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2️⃣ If logged in → user cannot go back to login page
  if (auth && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api).*)"], // Protect ALL routes except api & assets
};
