const safeParseURL = (url: string) => {
  try {
    const parsedURL = url.startsWith('http://') || url.startsWith('https://') ? new URL(url) : new URL(`https://${url}`);
    return parsedURL;
  } catch (e) {
    return null;
  }
};

export default safeParseURL;
