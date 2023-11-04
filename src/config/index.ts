export const appConfig = {
  scrapingBeeAPIKey: process.env.SCRAPING_BEE_API_KEY!,
  openAISecret: process.env.OPEN_AI_SECRET!,
  rocksetAPIEndpoint: process.env.ROCKSET_API_ENDPOINT!,
  rocksetAPIKey: process.env.ROCKSET_API_KEY!,
  spyfuAppId: process.env.SPYFU_APP_ID!,
  spyfuSecretKey: process.env.SPYFU_SECRET_KEY!,
  stripePubKey: process.env.STRIPE_PUB_KEY!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
} as const;
