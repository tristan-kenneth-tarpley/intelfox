import safeParseURL from '@/utils/safeParseURL';

const baseEmailSlug = 'ericsalgado949';

const generateForwardToEmail = (domain: string, type: 'competitor' | 'team'): string | null => {
  const url = safeParseURL(domain);
  if (!url) {
    return null;
  }

  return `${baseEmailSlug}+${type.charAt(0)}_${
    url.hostname.toLowerCase()
  }@gmail.com`;
};

export default generateForwardToEmail;
