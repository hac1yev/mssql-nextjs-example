import { NextResponse } from 'next/server';
import { getNewAccessToken, verifyJwtToken, verifyRefreshToken } from './lib/auth';

const AUTH_PAGES = ['/login', '/register'];

const isAuthPage = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request) {
    const { url,nextUrl,cookies } = request;
    const { value: accessToken } = cookies.get("accessToken") ?? {value: null};
    const { value: refreshToken } = cookies.get("refreshToken") ?? {value: null};

    const hasVerifiedJwtToken = accessToken && (await verifyJwtToken(accessToken));
    const hasVerifiedRefreshToken = refreshToken && (await verifyRefreshToken(refreshToken));

    const isAuthPageRequested = isAuthPage(nextUrl.pathname);

    if(isAuthPageRequested) {
        if(!hasVerifiedJwtToken) {
            if(hasVerifiedRefreshToken) {
                const { newAccessToken, newRefreshToken } = await getNewAccessToken(refreshToken);
                const hasVerifiedNewJwtToken = newAccessToken && (await verifyJwtToken(newAccessToken));
    
                if(hasVerifiedNewJwtToken) {
                    const response = NextResponse.redirect(new URL("/", url));
                    response.cookies.set({ name: 'accessToken', value: newAccessToken, path: '/' });
                    response.cookies.set({ name: 'refreshToken', value: newRefreshToken, path: '/', httpOnly: true, secure: true });
                    return response;
                }else{
                    return NextResponse.next();
                }
            }
    
            return NextResponse.next();
        }

        const response = NextResponse.redirect(new URL("/", url));
        return response;
    }

    if(!hasVerifiedJwtToken) {
        if(hasVerifiedRefreshToken) {
            const { newAccessToken, newRefreshToken } = await getNewAccessToken(refreshToken);
            const hasVerifiedNewJwtToken = newAccessToken && (await verifyJwtToken(newAccessToken));

            if(hasVerifiedNewJwtToken) {
                const response = NextResponse.next();
                response.cookies.set({ name: 'accessToken', value: newAccessToken, path: '/', httpOnly: true, secure: true });
                response.cookies.set({ name: 'refreshToken', value: newRefreshToken, path: '/', httpOnly: true, secure: true });
                return response;
            }else{
                return NextResponse.redirect(new URL("/login", url));
            }
        }
        return NextResponse.redirect(new URL("/login", url));
    }
    return NextResponse.next();
};
 
export const config = {
  matcher: ['/login', '/register'],
};