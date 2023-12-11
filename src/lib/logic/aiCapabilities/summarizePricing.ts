import joinOnNewLine from '@/utils/joinOnNewLine';
import createChatCompletionReducer from './createChatCompletionReducer';

const summarizePricing = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: joinOnNewLine([
      'Given the following summary of the pricing page, answer the following questions in one paragraph or less:',
      '- how do they segment their pricing?',
      '- what are the pricing amounts for each segment?',
      '- Which features are paywalled?',
      '- Is there a free plan?',
    ]),
    reconciliationMessage: joinOnNewLine([
      'Consolidate all of the following summaries', // todo structure as json
    ]),
  });
};

export default summarizePricing;
