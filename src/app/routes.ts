const welcome = () => '/welcome';
const home = () => '/home';

const buildUrl = (path: string[], query?: Record<string, string>) => {
  const queryString = new URLSearchParams(query).toString();
  return `${path.join('/')}?${queryString}`;
};

export const routes = {
  admin: () => '/admin',
  teamAdminPage: ({ teamId }: { teamId: string }) => buildUrl(['admin', 'teams', teamId]),
  root: () => '/',
  home,
  teamHome: ({ teamId }: { teamId: string }) => `/home/${teamId}`,
  teamCompetitors: ({ teamId }: { teamId: string }) => `/home/${teamId}/competitors`,
  teamKeyPhrases: ({ teamId }: { teamId: string }) => `/home/${teamId}/keyphrases`,
  welcome,
  afterSignupUrl: welcome,
  login: () => '/login',
  signup: () => '/signup',
  afterSigninUrl: home,
  welcomeCompetitors: ({ t }: { t: string }) => `/welcome/competitors?${new URLSearchParams({ t }).toString()}`,
  welcomeKeywords: ({ t }: { t: string }) => `/welcome/keywords?${new URLSearchParams({ t }).toString()}`,
  welcomeAbout: ({ t }: { t: string }) => `/welcome/about?${new URLSearchParams({ t }).toString()}`,
} as const;
