import openAIClient from '@/lib/services/openAI/client';
import openAI from 'openai';

const summarizeDescription = (description: string) => {
  return openAIClient.createModeratedChatCompletion({
    stream: false,
    messages: [
      {
        role: 'system',
        content: [
          'Given the following company description, summarize it in 1 sentence.',
          'Keep it less than 100 characters if possible.',
        ].join(' '),
      },
      {
        role: 'user',
        content: description,
      },
    ],
  }) as Promise<openAI.ChatCompletion>;
};

export default summarizeDescription;
