import { appConfig } from '@/config';
import getCurrentMonthName from '@/utils/getCurrentMonthName';
import sgMail from '@sendgrid/mail';
import { getYear } from 'date-fns/getYear';

sgMail.setApiKey(appConfig.sendGridApiKey);

const emailConstants = {
  fromEmails: {
    monthlyReport: 'tristan@intelfox.app',
  } as const,
  templates: {
    monthlyReport: 'd-da9bde8404434542a4eb74e8c8c88bd8',
  },
} as const;

/*
  section base schema:
    - header
    - description
    - who is it for? (team or competitor domain)
*/

interface Section {
  header: string;
  description: string;
  contents: Array<{
    preparedFor: string;
    content: string;
    header: string;
    link?: {
      href: string;
      text: string;
    }
  }>;
}

const sendgridService = {
  sendMonthlyReportEmail: async ({
    to,
    preheader,
    sections,
  }: {
    to: string[],
    preheader: string,
    sections: Section[]
  }) => {
    const dynamicTemplateData = {
      preheader,
      month: getCurrentMonthName(),
      year: getYear(new Date()),
      sections,
    } as const;

    return sgMail
      .send({
        to,
        from: emailConstants.fromEmails.monthlyReport,
        templateId: emailConstants.templates.monthlyReport,
        personalizations: to.map((email) => ({
          to: { email },
          dynamicTemplateData,
        })),
      });
  },
} as const;

export default sendgridService;
