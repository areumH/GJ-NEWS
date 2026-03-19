import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  if (!searchParams.get('query')?.trim()) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: '/search',
};