import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // If the user is trying to access the home page while authenticated, redirect to dashboard
    if (session && pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    // If the user is trying to access protected routes without being authenticated, redirect to home
    if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/profile'))) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Allow the request to continue in the pipeline if none of the above conditions are met
    return NextResponse.next();
}
