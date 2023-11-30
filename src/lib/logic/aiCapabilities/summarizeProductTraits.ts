import { MarketIntelReport } from '@prisma/client/edge';
import safeParseJSON from '@/utils/safeParseJSON';
import createChatCompletionReducer from './createChatCompletionReducer';

const jsonShape = [
  '{',
  '  "pros": <<array of strings, pros of the product>>',
  '  "cons": <<array of strings, cons of the product>>',
  '  "peopleGoodFor": <<array of strings, where each item is a description of the type of people who enjoy the product>>',
  '  "peopleNotGoodFor": <<array of strings, where each item is a description of the type of people who should not use the product>>',
  '}',
].join('\n');

const summarizeProductTraits = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: [
      'Summarize the pros and cons of the following webpage text.',
      'Only include two lists with no outro or intro.',
      'Return in the following json format:',
      jsonShape,
    ].join('\n'),
    reconciliationMessage: `Consolidate all of the following json objects into a single json object with the following shape: ${jsonShape}.`,
  }).then((reportString) => {
    if (!reportString) {
      return null;
    }

    return safeParseJSON<Pick<
    MarketIntelReport,
    | 'peopleGoodFor'
    | 'peopleNotGoodFor'
    | 'pros'
    | 'cons'
    >>(reportString);
  });
};

export default summarizeProductTraits;
