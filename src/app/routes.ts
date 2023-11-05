const welcome = () => '/welcome';
const home = () => '/home';

export const routes = {
  home,
  teamHome: ({ teamId }: { teamId: string }) => `/home/${teamId}`,
  welcome,
  afterSignupUrl: welcome,
  afterSigninUrl: home,
  welcomeCompetitors: ({ t }: { t: string }) => `/welcome/competitors?${new URLSearchParams({ t }).toString()}`,
  welcomeKeywords: ({ t }: { t: string }) => `/welcome/keywords?${new URLSearchParams({ t }).toString()}`,
  welcomeAbout: ({ t }: { t: string }) => `/welcome/about?${new URLSearchParams({ t }).toString()}`,
} as const;
