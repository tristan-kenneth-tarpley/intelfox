import { routes } from '@/app/routes';
import { redirect } from 'next/navigation';
import { PageProps } from '@/app/types';
import TeamLoader from '@/components/TeamLoader';
import { spyfuService } from '@/lib/services/spyfu/spyfuService';
import { cache } from 'react';
import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import KeywordPageClient from './KeywordPageClient';

// 1 hour
export const revalidate = 60 * 60;

const cachedSpyfuCalls = {
  getCachedSEOKeywords: cache((domain: string) => spyfuService.getSEOKeywordsByValue(domain)),
  getCachedPPCKeywords: cache((domain: string) => spyfuService.getMostSuccessfulPPCKeywords(domain)),
  getCachedPPCCompetitors: cache((domain: string) => spyfuService.getPPCCompetitors(domain)),
  getCachedSEOCompetitors: cache((domain: string) => spyfuService.getSEOCompetitors(domain)),
};

const KeywordSelectionPage = ({
  searchParams,
}: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {async ({ team }) => {
        const {
          getCachedSEOKeywords,
          getCachedPPCKeywords,
        } = cachedSpyfuCalls;
        // todo add error handling
        const [
          seoKeywords,
          ppcKeywords,
          trackedKeyPhrases,
        ] = await Promise.all([
          getCachedSEOKeywords(team.primaryDomain),
          getCachedPPCKeywords(team.primaryDomain),
          getTrackedKeyPhrasesByTeam(team.id),
        ]);

        return (
          <KeywordPageClient
            seoKeywords={seoKeywords.data}
            ppcKeywords={ppcKeywords.data}
            team={team}
            trackedKeyPhrases={trackedKeyPhrases}
          />
        );
      }}
    </TeamLoader>
  );
};

export default KeywordSelectionPage;
