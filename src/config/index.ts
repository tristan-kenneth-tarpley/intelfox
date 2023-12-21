export const appConfig = {
  airtableSecretKey: process.env.AIRTABLE_API_KEY!,
  cronSecret: process.env.CRON_SECRET!,
  nodeEnv: process.env.NODE_ENV!,
  scrapingBeeAPIKey: process.env.SCRAPING_BEE_API_KEY!,
  openAISecret: process.env.OPENAI_API_KEY!,
  rocksetAPIEndpoint: process.env.ROCKSET_API_ENDPOINT!,
  rocksetAPIKey: process.env.ROCKSET_API_KEY!,
  spyfuAppId: process.env.SPYFU_APP_ID!,
  spyfuSecretKey: process.env.SPYFU_SECRET_KEY!,
  stripePubKey: process.env.STRIPE_PUB_KEY!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  nangoPublicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY!,
  nangoSecretKey: process.env.NANGO_SECRET_KEY,
  selfUrl: process.env.SELF_URL!,
  zeploSecret: process.env.ZEPLO_SECRET!,
  zapierWebhookSecret: process.env.ZAPIER_WEBHOOK_SECRET!,
  sendGridApiKey: process.env.SENDGRID_API_KEY!,
} as const;
