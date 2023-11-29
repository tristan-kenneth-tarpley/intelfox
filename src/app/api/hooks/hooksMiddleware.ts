import makeRequestError from '@/app/actions/makeRequestError';
import { appConfig } from '@/config';
import { NextRequest } from 'next/server';

const hooksMiddleware = (req: NextRequest) => {
  const { headers } = req;
  const authorization = headers.get('X-Zapier-Webhook-Secret');

  if (!authorization || authorization !== appConfig.zapierWebhookSecret) {
    return Response.json(makeRequestError({ code: 401, message: 'Unauthorized' }), { status: 401 });
  }
};

export default hooksMiddleware;
