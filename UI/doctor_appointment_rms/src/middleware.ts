import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes: Record<string, string[]> = {
  Admin: [
    '/dashboard/admin',
    '/dashboard/profile',
    '/dashboard/settings'
  ],
  Doctor: [
    '/dashboard/appointments',
    '/dashboard/calendar',
    '/dashboard/availability',
    '/dashboard/prescriptions',
    '/dashboard/medical-records',
    '/dashboard/lab',
    '/dashboard/notifications',
    '/dashboard/profile',
    '/dashboard/settings'
  ],
  Registered: [ 
    '/dashboard/appointments',
    '/dashboard/medical-records',
    '/dashboard/prescriptions',
    '/dashboard/lab',
    '/dashboard/notifications',
    '/dashboard/doctors',
    '/dashboard/profile',
    '/dashboard/settings'
  ],
  LabTechnician: [
    '/dashboard/lab',
    '/dashboard/profile',
    '/dashboard/settings'
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow ingest/analytics routes to pass natively
  if (pathname.startsWith('/ingest')) {
    return NextResponse.next();
  }

  // Protect all paths starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT to extract the Role
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);

      const userRole = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      // RULE 1: Everyone is allowed on the root dashboard page
      if (pathname === '/dashboard') {
        return NextResponse.next();
      }

      // RULE 2: Get the allowed routes for the current user's role
      const allowedRoutes = roleRoutes[userRole] || [];

      // RULE 3: Check if the current pathname matches any allowed routes
      // .some() checks if the current URL starts with any of the allowed base paths
      const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

      if (!isAllowed) {
        // DENY BY DEFAULT: If the route isn't in their list, redirect to root dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // Token is invalid or malformed
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('access_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ingest/:path*'
  ],
};