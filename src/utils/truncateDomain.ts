const truncateDomain = (domain: string) => {
  const asUrl = new URL(domain);
  const split = asUrl.hostname.split('.');
  return split[split.length - 2];
};

export default truncateDomain;
