import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { config } from '$lib/config';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const expectedToken = env.QUIZ_SHARED_SECRET;

  if (!expectedToken || !authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return all stored redirect URLs (the source of truth for cc-quiz link generation)
  return json({
    redirectUrls: config.redirectUrls,
    resultDisplay: config.resultDisplay,
  });
};
