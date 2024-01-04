import { EmailMessagingProfile } from '@prisma/client/edge';
import safeParseJSON from '@/utils/safeParseJSON';
import createChatCompletionReducer from '../createChatCompletionReducer';

const jsonShape = [
  '{',
  '  "title": <<pick a title from the email to use as the headline>>',
  '  "personality": <<array of the following shape: {trait: <<the personality trait the company is trying to exude>>, description: <<a 1-2 sentence description of how this personality trait is shown>>}>>',
  '  "summary": <<string, give a tl;dr of the email content>>',
  '  "category": <<string, one of "promotion" | "info" | "announcement" | "alert">>',
  '}',
].join('\n');

const summarizeEmailMessaging = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: [
      'Summarize the following content based on the following criteria, returned in the following json format:',
      jsonShape,
    ].join('\n'),
    reconciliationMessage: `Consolidate all of the following json objects into a single json object with the following shape: ${jsonShape}.`,
    responseType: 'json_object',
  }).then((reportString) => {
    if (!reportString) {
      return null;
    }

    console.log('reportString', reportString);
    return safeParseJSON<EmailMessagingProfile>(reportString);
  });
};

export default summarizeEmailMessaging;
