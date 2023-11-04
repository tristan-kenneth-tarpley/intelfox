export const routes = {
  home: () => '/home',
  welcome: () => '/welcome',
  welcomeCompetitors: () => '/welcome/competitors',
  welcomeKeywords: () => '/welcome/keywords',
  welcomeAbout: ({ orgId }: { orgId: string }) => `/welcome/about?${new URLSearchParams({ orgId }).toString()}`,
} as const;
