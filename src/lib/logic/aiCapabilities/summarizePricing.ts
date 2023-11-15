import createChatCompletionReducer from './createChatCompletionReducer';

const summarizePricing = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: [
      'Summarize the following pricing page into one to two paragraphs.',
      'Include prices, features, and any other relevant information.',
      'Describe the billing cycles, for example whether it is a subscription service, a la carte, consulting, etc.',
    ].join('\n'),
    reconciliationMessage: 'Consolidate all of the following summaries into one to two readable paragraphs summarizing the pricing of this company.',
  });
};

export default summarizePricing;
