import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect the lab-portal route group
  if (request.nextUrl.pathname.startsWith('/ingest')) {
    // Optional: Add a custom check here (like checking a specific cookie or header)
    // If you don't have one, this remains a "Security by Obscurity" 
    // unless you add an actual Auth check.
    return NextResponse.next();
  }
  return NextResponse.next();
}