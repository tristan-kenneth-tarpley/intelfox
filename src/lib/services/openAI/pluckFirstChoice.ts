import { ChatCompletion } from 'openai/resources/index.mjs';

const pluckFirstChoice = (data: any) => {
  const typedRes = data as any as ChatCompletion;

  return typedRes.choices[0].message.content;
};

export default pluckFirstChoice;
