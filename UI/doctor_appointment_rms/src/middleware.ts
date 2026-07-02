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


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // 1. Protect all paths starting with /dashboard
//   if (pathname.startsWith('/dashboard')) {
//     // Matches the exact cookie name we set during client-side login
//     const token = request.cookies.get('Access_token')?.value;

//     if (!token) {
//       // If no cookie exists, block rendering instantly and redirect to login
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // 2. Allow the /ingest path to pass through natively 
//   // (Your page handles its own X-Lab-Access-Key check in the UI layout)
//   if (pathname.startsWith('/ingest')) {
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/ingest/:path*'
//   ],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all paths starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('Access_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Decode JWT to extract the Role (Edge-compatible parsing)
    try {
      // Split the JWT to get the payload (second part)
      const payloadBase64Url = token.split('.')[1];
      
      // Fix base64url encoding characters to standard base64 characters
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode using Edge-safe atob
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);

      // Extract role (Checking both standard 'role' and .NET specific claim URIs)
      const userRole = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      // RBAC RULE A: LabTechnicians MUST stay in /dashboard/lab
      if (userRole === 'LabTechnician' && pathname !== '/dashboard/lab') {
        return NextResponse.redirect(new URL('/dashboard/lab', request.url));
      }

      // RBAC RULE B: Non-LabTechnicians CANNOT access /dashboard/lab
      if (userRole !== 'LabTechnician' && pathname.startsWith('/dashboard/lab')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // RBAC RULE C: Only Admins can access /dashboard/admin
      if (userRole !== 'Admin' && pathname.startsWith('/dashboard/admin')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // If token decoding fails (malformed token), clear it and force re-login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('Access_token');
      return response;
    }
  }

  // 3. Allow /ingest to pass natively 
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