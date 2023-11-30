import { NextRequest } from 'next/server';
import prepIntelReports from '@/jobs/prepIntelReports';
import jobsMiddleware from '../jobsMiddleware';

export async function POST(request: NextRequest) {
  const middleware = jobsMiddleware(request);
  if (middleware) {
    return middleware;
  }

  await prepIntelReports();
  return Response.json({ status: 'success' });
}
