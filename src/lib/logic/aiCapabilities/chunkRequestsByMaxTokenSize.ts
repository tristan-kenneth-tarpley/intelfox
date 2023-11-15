import { DefaultModels } from '@/lib/services/openAI/client';
import estimateChatTokenSize from '@/lib/services/openAI/estimateChatTokenSize';
import estimateEmbeddingsTokenSize from '@/lib/services/openAI/estimateEmbeddingsTokenSize';

const maxTokensByModel = {
  [DefaultModels.chat]: {
    maxTokens: 12000,
    estimatorFn: estimateChatTokenSize,
  },
  [DefaultModels.embeddings]: {
    maxTokens: 7000,
    estimatorFn: estimateEmbeddingsTokenSize,
  },
} as const;

const chunkRequestsByMaxTokenSize = (model: keyof typeof maxTokensByModel) => <TIterable>(iterable: TIterable[], predicate: (item: TIterable) => string) => {
  const { maxTokens, estimatorFn } = maxTokensByModel[model];

  const chunks: TIterable[][] = [];
  iterable.forEach((item) => {
    const lastChunk = chunks[chunks.length - 1];
    const text = predicate(item);
    const itemTokenSize = estimatorFn(text);

    if (itemTokenSize > maxTokens) {
      throw new Error(`No single item can be more than ${maxTokens} tokens.`);
    }

    if (!lastChunk) {
      chunks.push([item]);
      return;
    }

    const totalChunkSize = estimatorFn(lastChunk.map(predicate).join('\n'));

    if ((totalChunkSize + itemTokenSize) <= maxTokens) {
      chunks[chunks.length - 1] = [...lastChunk, item];
      return;
    }

    chunks.push([item]);
  });

  return chunks;
};

export const chunkEmbeddingsRequestsByTokenSize = chunkRequestsByMaxTokenSize(DefaultModels.embeddings);
export const chunkChatRequestsByTokenSize = chunkRequestsByMaxTokenSize(DefaultModels.chat);

export default chunkRequestsByMaxTokenSize;
