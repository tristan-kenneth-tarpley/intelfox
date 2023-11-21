/* eslint-disable no-useless-escape */
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // todo remove data-collection and add proper auth
  publicRoutes: [
    '/',
    '/api/data-collection/reddit',
    /^\/api\/jobs(?:\/([^\/#\?]+?))[\/#\?]?$/i,
    '/login',
    '/signup',
  ],
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
