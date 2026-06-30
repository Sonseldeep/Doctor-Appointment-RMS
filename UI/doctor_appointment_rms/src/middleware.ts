// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // Protect the lab-portal route group
//   if (request.nextUrl.pathname.startsWith('/ingest')) {
//     // Optional: Add a custom check here (like checking a specific cookie or header)
//     // If you don't have one, this remains a "Security by Obscurity" 
//     // unless you add an actual Auth check.
//     return NextResponse.next();
//   }
//   return NextResponse.next();
// }


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all paths starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Matches the exact cookie name we set during client-side login
    const token = request.cookies.get('Access_token')?.value;

    if (!token) {
      // If no cookie exists, block rendering instantly and redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Allow the /ingest path to pass through natively 
  // (Your page handles its own X-Lab-Access-Key check in the UI layout)
  if (pathname.startsWith('/ingest')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ingest/:path*'
  ],
};