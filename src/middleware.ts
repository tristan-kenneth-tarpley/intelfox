/* eslint-disable no-useless-escape */
import { authMiddleware } from '@clerk/nextjs';
import { routes } from './app/routes';

export default authMiddleware({
  // todo remove data-collection and add proper auth
  publicRoutes: [
    '/',
    '/api/data-collection/reddit',
    /^\/api\/jobs(?:\/([^\/#\?]+?))[\/#\?]?$/i,
    /^\/api\/hooks(?:\/([^\/#\?]+?))[\/#\?]?$/i,
    '/login',
    '/signup',
  ],
  signInUrl: routes.login(),
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
