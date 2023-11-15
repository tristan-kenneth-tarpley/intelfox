import OpenAI from 'openai';

import logger from '@/lib/logger';
import { AppError, LOG_PREFIXES } from '@/lib/logic/errors';
import { appConfig } from '@/config';

const openai = new OpenAI({
  apiKey: appConfig.openAISecret,
});

export const DefaultModels = {
  chat: 'gpt-3.5-turbo-16k',
  embeddings: 'text-embedding-ada-002',
} as const;

type ModeratedChatCompletionParams = Omit<OpenAI.ChatCompletionCreateParams, 'model'> & { model?: OpenAI.ChatCompletionCreateParams['model'] };
type EmbeddingCreateParams = Omit<OpenAI.EmbeddingCreateParams, 'model'> & { model?: OpenAI.EmbeddingCreateParams['model'] };

const openAIClient = {
  createChatCompletion: openai.chat.completions.create,
  getEmbeddings: (request: EmbeddingCreateParams) => openai.embeddings.create({ ...request, model: request.model ?? DefaultModels.embeddings }),
  createModeratedChatCompletion: async (request: ModeratedChatCompletionParams) => {
    const { messages, model = DefaultModels.chat } = request;

    try {
      await openai.moderations.create({ input: messages.map(({ content }) => content).join('\n') });
    } catch (error: any) {
      logger.error(`${LOG_PREFIXES.openAI} ${error.message}`);
      throw new AppError('OpenAIModerationError', { error });
    }

    try {
      const response = await openai.chat.completions.create({ ...request, model });
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
