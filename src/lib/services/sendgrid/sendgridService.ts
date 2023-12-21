import { appConfig } from '@/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(appConfig.sendGridApiKey);

const emailConstants = {
  fromEmails: {
    monthlyReport: 'tristan@intelfox.app',
  } as const,
} as const;

const sendgridService = {
  sendMonthlyReportEmail: async ({
    to,
    subject,
    text,
    html,
  }: {
    to: string,
    subject: string, // todo maybe encapsulate this
    text: string, // todo maybe handle both of these in same fn?
    html: string,
  }) => {
    return sgMail
      .send({
        to,
        from: emailConstants.fromEmails.monthlyReport,
        subject,
        text,
        html,
      });
  },
} as const;

export default sendgridService;
