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

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify<TokenPayload>(token, secret);

    if (matchedRoleRoute && payload.role !== roleProtectedRoutes[matchedRoleRoute]) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch {
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