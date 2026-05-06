import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize lowercase casinoAdda URLs to the existing route folder.
  const isLowercaseCasinoAddaPath =
    pathname.startsWith('/casinoadda') || pathname.startsWith('/casinoAdda');

  if (isLowercaseCasinoAddaPath) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/casinoadda/i, '/CasinoAdda');
    return NextResponse.redirect(url);
  }

  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico' ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$/.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
};