import { KeyPhraseFeedResult } from '@/lib/services/rockset/lambdas/getKeyphraseFeedResults';
import joinOnNewLine from '@/utils/joinOnNewLine';
import isTruthy from '@/utils/isTruthy';
import { Teams } from '@prisma/client/edge';
import safeParseJSON from '@/utils/safeParseJSON';
import createChatCompletionReducer from './createChatCompletionReducer';

const format = joinOnNewLine([
  'Array<{',
  '  index: <<number, the index of the post as supplied in the context>>',
  '}>',
]);

// todo test
const pickRelevantScrapedItems = async (items: KeyPhraseFeedResult[], team: Teams) => {
  const response = await createChatCompletionReducer(items.map((item, index) => joinOnNewLine([
    `title: ${item.text}`,
    `${item.type} body text: ${item.bodyText}`,
    item.type === 'COMMENT' ? `Text of post where this comment was posted: ${item.parentText}` : null,
    `index: ${index}`,
  ].filter(isTruthy))), {
    baseSystemMessage: joinOnNewLine([
      `You are a social media analyst for a company called ${team.name} with the following description: ${team.description}.`,
      'Your job is to analyze posts from different forums to figure out whether they are relevant for your team.',
      'A post is relevant if the poster is interested in buying a product like what you offer, they are providing feedback about the market, or they mention the company or a competitor specifically.',
      'Given a scale of 1-10, where 1 is completely irrelevant and 10 is directly relevant, if a post rates between 8-10, return the index of the post and insert it into the array.',
      'If the rating is below an 8, omit it from your response.',
      'Return the data in a JSON array with the following format:',
      format,
    ]),
    reconciliationMessage: joinOnNewLine([
      'Consolidate the reports into a single JSON array in the following format:',
      format,
    ]),
    responseType: 'json_object',
  });

  console.log('scraped items response', response);
  const parsedResponse = response
    ? safeParseJSON<{ index: number }[]>(response)
    : null;

  console.log('parsed response', parsedResponse?.length ?? 'null');

  return parsedResponse?.map(({ index }) => items[index]).filter(isTruthy) ?? null;
};

export default pickRelevantScrapedItems;
