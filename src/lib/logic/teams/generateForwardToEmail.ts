import safeParseURL from '@/utils/safeParseURL';

const baseEmailSlug = 'ericsalgado949';

const generateForwardToEmail = (domain: string): string | null => {
  const url = safeParseURL(domain);
  if (!url) {
    return null;
  }

  return `${baseEmailSlug}+${
    url.hostname
      .split('.')[0]
      .toLowerCase()
  }@gmail.com`;
};

export default generateForwardToEmail;
