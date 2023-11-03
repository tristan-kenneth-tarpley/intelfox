import OpenAI from 'openai';

import logger from '@/lib/logger';
import { AppError, LOG_PREFIXES } from '@/lib/logic/errors';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET,
});

const openAIClient = {
  getEmbeddings: (request: OpenAI.EmbeddingCreateParams) => openai.embeddings.create(request),
  createModeratedChatCompletion: async (request: OpenAI.ChatCompletionCreateParams) => {
    const { messages } = request;

    try {
      await openai.moderations.create({ input: messages.map(({ content }) => content).join('\n') });
    } catch (error: any) {
      logger.error(`${LOG_PREFIXES.openAI} ${error.message}`);
      throw new AppError('OpenAIModerationError', { error });
    }

    try {
      const response = await openai.chat.completions.create(request);
      return response;
    } catch (error: any) {
      logger.error(`${LOG_PREFIXES.openAI} Error getting chat response: ${error.message}`);

      const { status } = error.response;
      if (status === 400) {
        throw new AppError('OpenAITokenLimitError');
      } else if (status === 429) {
        throw new AppError('OpenAIRateLimitError');
      } else {
        throw new AppError('OpenAIError');
      }
    }
  },
};

export default openAIClient;
