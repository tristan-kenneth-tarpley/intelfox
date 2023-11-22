import { Competitors, Teams } from '@prisma/client/edge';

const baseEmailSlug = 'ericsalgado949';

const generateForwardToEmail = (team: Teams | Competitors): string => {
  return `${baseEmailSlug}+${
    team.name
      .split(' ')
      .join('_')
      .toLowerCase()
  }@gmail.com`;
};

export default generateForwardToEmail;
