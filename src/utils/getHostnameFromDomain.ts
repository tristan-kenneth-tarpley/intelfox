const getHostnameFromDomain = (domain: string) => {
  const asUrl = new URL(domain);
  return asUrl.hostname;
};

export default getHostnameFromDomain;
