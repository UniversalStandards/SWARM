import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/error', '/api/auth'];
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/workflows') ||
    pathname.startsWith('/agents') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/templates')
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    // TODO: Implement rate limiting middleware
    // const identifier = request.ip || 'anonymous';
    // const { success } = await rateLimit.check(identifier);
    // if (!success) {
    //   return new NextResponse('Too Many Requests', { status: 429 });
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
