const welcome = () => '/welcome';
const home = () => '/home';

export const routes = {
  root: () => '/',
  home,
  teamHome: ({ teamId }: { teamId: string }) => `/home/${teamId}`,
  teamCompetitors: ({ teamId }: { teamId: string }) => `/home/${teamId}/competitors`,
  teamKeyPhrases: ({ teamId }: { teamId: string }) => `/home/${teamId}/keyphrases`,
  welcome,
  afterSignupUrl: welcome,
  afterSigninUrl: home,
  welcomeCompetitors: ({ t }: { t: string }) => `/welcome/competitors?${new URLSearchParams({ t }).toString()}`,
  welcomeKeywords: ({ t }: { t: string }) => `/welcome/keywords?${new URLSearchParams({ t }).toString()}`,
  welcomeAbout: ({ t }: { t: string }) => `/welcome/about?${new URLSearchParams({ t }).toString()}`,
} as const;
