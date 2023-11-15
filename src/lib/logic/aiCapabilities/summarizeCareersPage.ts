import createChatCompletionReducer from './createChatCompletionReducer';

const jsonFormat = [
  '{',
  '  "listings": [',
  '    {',
  '      "title": <<the title of the job listing>>',
  '      "location": <<the location of the job listing>>',
  '      "department": <<the department of the job listing>>',
  '    },',
  '  ]',
  '}',
].join('\n');

const summarizeCareersPage = async (input: string) => {
  return createChatCompletionReducer(input?.split(' ') ?? [], {
    baseSystemMessage: [
      'Summarize the job listings available as displayed on the following careers page.',
      'Return in the following json format:',
      jsonFormat,
    ].join('\n'),
    reconciliationMessage: `Consolidate all of the following summaries into one json object of the following format: ${jsonFormat}.`,
  }).then((reportString) => {
    if (!reportString) {
      return null;
    }

    return JSON.parse(reportString) as {
      listings: Array<{
        title: string;
        location: string;
        department: string;
      }>
    };
  });
};

export default summarizeCareersPage;
