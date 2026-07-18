import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for the better-auth session token cookie
  const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

  // If no session token is present, redirect to the login page
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed if the user is authenticated
  return NextResponse.next();
}

export const config = {
  // Protect all dashboard routes
  matcher: [
    '/admin/dashboard/:path*', 
    '/buyer/dashboard/:path*'
  ],
};
