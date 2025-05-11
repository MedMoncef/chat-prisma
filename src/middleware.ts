import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;
  
  // If accessing authenticated routes without a token, redirect to login
  if (pathname.startsWith('/chat') && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If accessing auth pages with a token, redirect to chat
  if ((pathname === '/login' || pathname === '/register') && authToken) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
  
  // Redirect root to chat if authenticated, otherwise to login
  if (pathname === '/' && authToken) {
    return NextResponse.redirect(new URL('/chat', request.url));
  } else if (pathname === '/' && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/register', '/chat/:path*'],
};
