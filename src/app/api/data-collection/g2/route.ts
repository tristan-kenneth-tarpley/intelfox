import collectG2Reviews from './collectG2Reviews';

export async function GET() {
  await collectG2Reviews();

  return Response.json({ success: true });
}
