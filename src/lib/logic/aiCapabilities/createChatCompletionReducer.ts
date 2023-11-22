import openAIClient from '@/lib/services/openAI/client';
import pluckFirstChoice from '@/lib/services/openAI/pluckFirstChoice';
import { chunkChatRequestsByTokenSize } from './chunkRequestsByMaxTokenSize';

const createChatCompletionReducer = async (input: string[], {
  baseSystemMessage,
  reconciliationMessage,
}: {
  baseSystemMessage: string,
  reconciliationMessage: string,
}) => {
  const requests = chunkChatRequestsByTokenSize(input, (item) => item);
  const baseMessages = [
    {
      role: 'system' as const,
      content: baseSystemMessage,
    },
  ];

  const makeParams = (content: string) => ({
    stream: false,
    temperature: 0,
    max_tokens: 15000,
    messages: [...baseMessages, {
      role: 'user' as const,
      content,
    }],
  });

  const handleError = (error: any) => {
    console.error(error);
    return null;
  };

  if (requests.length === 1) {
    console.log('requesting single chunk');
    return openAIClient.createModeratedChatCompletion(
      makeParams(requests[0].join('\n')),
    ).then(pluckFirstChoice).catch(handleError);
  }

  // todo, if only one chunk, just make one openAI request
  const responses = await Promise.all(requests.map(async (request, index) => {
    console.log(`requesting chunk ${index} of ${requests.length}`);
    return openAIClient.createModeratedChatCompletion(
      makeParams(request.join('\n')),
    ).then(pluckFirstChoice).catch(handleError);
  }));

  console.log('requesting final chunk');
  return openAIClient.createModeratedChatCompletion({
    stream: false,
    messages: [
      { role: 'system' as const, content: reconciliationMessage },
      ...responses.map((response) => ({
        role: 'user' as const,
        content: response,
      })),
    ],
  }).then(pluckFirstChoice).catch(handleError);
};

export default createChatCompletionReducer;
