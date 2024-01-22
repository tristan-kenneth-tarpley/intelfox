import { GenericMessagingProfile } from "@prisma/client/edge";
import safeParseJSON from "@/utils/safeParseJSON";
import createChatCompletionReducer from "../createChatCompletionReducer";

const jsonShape = [
  "{",
  '  "companyName": <<the name of the company>>',
  '  "keyValueProps": <<array of strings, 3-5 core value propositions that the company is trying to communicate>>',
  '  "personality": <<array of the following shape: {trait: <<the personality trait the company is trying to exude>>, description: <<a 1-2 sentence description of how this personality trait is shown>>}>>',
  '  "summary": <<string, a short, 1 paragraph summary of the company and its products>>',
  '  "keywords": <<array of strings no longer than 5. Each item should be 1-2 word phrases. These will be used to search forums for conversations relevant to this company in order to find opportunities to mention the company in those forums. Include the brand name of each product offered by the company, names the company may go by, and SEO keywords. Be specific. Phrases that are too broad will get rejected. For example, for a digital signage software provider, include words like "digital signage", "digital signage software", and the names of the different products and features.',
  "}",
].join("\n");

const summarizeMessaging = async (input: string) => {
  return createChatCompletionReducer(input?.split(" ") ?? [], {
    baseSystemMessage: [
      "Summarize the following content based on the following criteria, returned in the following json format:",
      jsonShape,
    ].join("\n"),
    reconciliationMessage: `Consolidate all of the following json objects into a single json object with the following shape: ${jsonShape}.`,
    responseType: "json_object",
  }).then((reportString) => {
    if (!reportString) {
      return null;
    }

    return safeParseJSON<GenericMessagingProfile>(reportString);
  });
};

export default summarizeMessaging;
