import { encodingForModel } from 'js-tiktoken';

const enc = encodingForModel('gpt-3.5-turbo-16k');

const estimateChatTokenSize = (text: string) => {
  return enc.encode(text).length;
};

export default estimateChatTokenSize;
