import makeRequestError from '@/app/actions/makeRequestError';
import { appConfig } from '@/config';
import { NextRequest } from 'next/server';

const jobsMiddleware = (req: NextRequest) => {
  const { headers } = req;
  const authorization = headers.get('authorization');

  if (!authorization || authorization !== `Bearer ${appConfig.cronSecret}`) {
    return Response.json(makeRequestError({ code: 401, message: 'Unauthorized' }), { status: 401 });
  }
};

export default jobsMiddleware;
