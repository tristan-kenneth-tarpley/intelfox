import { NextRequest } from 'next/server';
import hooksMiddleware from '../hooksMiddleware';

export async function POST(request: NextRequest) {
  const middleware = hooksMiddleware(request);
  if (middleware) {
    return middleware;
  }

  console.log('received', await request.json());
  return Response.json({ status: 'success' });
}
