/* eslint-disable no-useless-escape */
import { authMiddleware } from '@clerk/nextjs';
import { appConfig } from './config';
import makeRequestError from './app/actions/makeRequestError';

export default authMiddleware({
  // todo remove data-collection and add proper auth
  publicRoutes: ['/', '/api/data-collection/reddit', /^\/api\/jobs(?:\/([^\/#\?]+?))[\/#\?]?$/i],
  afterAuth: (auth, req) => {
    if (new URL(req.url).pathname.startsWith('/api/jobs')) {
      const { headers } = req;
      const authorization = headers.get('authorization');

      if (!authorization || authorization !== `Bearer ${appConfig.cronSecret}`) {
        return Response.json(makeRequestError({ code: 401, message: 'Unauthorized' }), { status: 401 });
      }
    }
  },
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
