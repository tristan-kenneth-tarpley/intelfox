const scrollCommand = {
  // arbitrarily large value
  scroll_y: 100000,
};

const waitCommand = {
  wait: 2000,
};

const jsScenario = {
  instructions: [
    scrollCommand,
    waitCommand,
    scrollCommand,
    waitCommand,
  ],
};

// todo could potentially rollback the params and increase if we encounter a captcha...
// but that might end up being more credits at the end of things, so maybe not worth it
const strengthParams = {
  block_ads: true,
  premium_proxy: true,
  stealth_proxy: false, // todo monitor this and see if we get blocked
};

export const redditScrapeConfig = {
  // todo could add extract_rules to only get the list that we want
  ...strengthParams,
  js_scenario: jsScenario,
};
