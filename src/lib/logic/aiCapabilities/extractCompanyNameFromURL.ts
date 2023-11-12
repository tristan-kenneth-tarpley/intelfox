import openAIClient from '@/lib/services/openAI/client';
import openAI from 'openai';

const extractCompanyNameFromURL = (domain: string) => {
  return openAIClient.createModeratedChatCompletion({
    stream: false,
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: [
          'From the following domain, respond with the company name that the site is for.',
          'Only respond with the company name and nothing else.',
        ].join(' '),
      },
      {
        role: 'user',
        content: domain,
      },
    ],
  }) as Promise<openAI.ChatCompletion>;
};

export default extractCompanyNameFromURL;
