const personalDomains = new Set([
  'gmail',
  'gamil',
  'yahoo',
  'hotmail',
  'aol',
  'protonmail',
  'zoho',
  'mail',
  'yandex',
  'outlook',
  'msn',
  'live',
  'icloud',
  'me',
  'mac',
  'apple',
  'xfinity',
  'comcast',
  'sbcglobal',
  'telus',
  'gmx',
  'web',
  'inbox',
  'fastmail',
  'hushmail',
  'shortmail',
  'mailbox',
]);

const parseEmailAddress = (email: string) => {
  const [, domain] = email.split('@');
  const domainWithoutExtension = domain.split('.')[0];

  return {
    isPersonalAddress: personalDomains.has(domainWithoutExtension),
    domain,
    email,
  };
};

export default parseEmailAddress;
