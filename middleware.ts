import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to public routes
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname.startsWith('/auth/') ||
      request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // For all other routes, let NextAuth handle authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}