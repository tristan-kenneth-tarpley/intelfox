import createChatCompletionReducer from './createChatCompletionReducer';

const jsonShape = [
  '{',
  '  "companyName": <<the name of the company>>',
  '  "keyValueProps": <<array of strings, 3-5 core value propositions that the company is trying to communicate>>',
  '  "emotions": <<array of strings, the emotions that the company is trying to make the visitor feel>>',
  '  "personality": <<array of strings, the personality traits that the company is trying to exude>>',
  '  "summary": <<string, a short, 1 paragraph summary of the company and its products>>',
  '}',
].join('\n');

const summarizeMessaging = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: [
      'Summarize the following website content based on the following criteria, returned in the following json format:',
      jsonShape,
    ].join('\n'),
    reconciliationMessage: `Consolidate all of the following json objects into a single json object with the following shape: ${jsonShape}.`,
  }).then((reportString) => {
    if (!reportString) {
      return null;
    }

    console.log('reportString', reportString);
    // add rationale/reasoning to each of these points
    return JSON.parse(reportString) as {
      companyName: string;
      keyValueProps: string[];
      emotions: string[];
      personality: string[];
      summary: string;
    };
  });
};

export default summarizeMessaging;
