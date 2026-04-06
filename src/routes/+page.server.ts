import { config } from '$lib/config';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const s1 = url.searchParams.get('s1') || '';

  // If s1 is provided, resolve affiliate sub-links from the affiliate platform
  let affiliateSlugMap: Record<string, string> | null = null;
  if (s1) {
    const affiliateApiUrl = env.AFFILIATE_API_URL;
    const affiliateApiToken = env.QUIZ_SHARED_SECRET;
    if (affiliateApiUrl && affiliateApiToken) {
      try {
        const res = await fetch(`${affiliateApiUrl}/api/quiz/resolve-links?parentSlug=${encodeURIComponent(s1)}`, {
          headers: { 'Authorization': `Bearer ${affiliateApiToken}` },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          affiliateSlugMap = await res.json();
        }
      } catch (err) {
        console.error('[quiz] Failed to resolve affiliate links:', err);
      }
    }
  }

  return {
    config: {
      creatorName: config.creatorName,
      creatorTagline: config.creatorTagline,
      creatorPhoto: config.creatorPhoto,
      accentColor: config.accentColor,
      heroH1: config.heroH1,
      heroSubtext: config.heroSubtext,
      trustPills: config.trustPills,
      voiceLabel: config.voiceLabel,
      redirectMessage: config.redirectMessage,
      resultDisplay: config.resultDisplay,
      pageTitle: config.pageTitle,
    },
    s1,
    affiliateSlugMap,
  };
};
