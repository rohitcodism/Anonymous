import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

    const token = await getToken({req})
    const url = req.nextUrl

    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')  ||
        url.pathname.startsWith('/')
    )
    
    ){
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}