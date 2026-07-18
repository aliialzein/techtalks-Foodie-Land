import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Requires a specific role
const roleProtectedRoutes: Record<string, string> = {
  "/admin": "ADMIN",
  "/restaurant": "OWNER",
};

// Requires any logged-in user, role doesn't matter
const authOnlyRoutes = ["/cart", "/orders", "/checkout", "/reservations"];

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const matchedRoleRoute = Object.keys(roleProtectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  const isAuthOnly = authOnlyRoutes.some((route) => pathname.startsWith(route));

  if (!matchedRoleRoute && !isAuthOnly) {
    return NextResponse.next();
  }

  const token = request.cookies.get("foodieland-token")?.value;

  console.log("[middleware] path:", pathname);
  console.log("[middleware] JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET), "length:", process.env.JWT_SECRET?.length);
  console.log("[middleware] token present:", Boolean(token));

  if (!token) {
    console.log("[middleware] NO TOKEN -> redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify<TokenPayload>(token, secret);
    console.log("[middleware] token verified OK, role in token:", payload.role);

    if (matchedRoleRoute && payload.role !== roleProtectedRoutes[matchedRoleRoute]) {
      console.log("[middleware] ROLE MISMATCH -> redirecting to /unauthorized. required:", roleProtectedRoutes[matchedRoleRoute], "got:", payload.role);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("[middleware] JWT VERIFY FAILED -> redirecting to /login. Error:", err);
    // Expired, tampered, or bad signature — drop the stale cookie too.
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("foodieland-token");
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/restaurant/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/reservations/:path*",
  ],
};