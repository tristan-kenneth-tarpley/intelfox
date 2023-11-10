import { encoding_for_model } from 'tiktoken';

const enc = encoding_for_model('gpt-3.5-turbo-16k');

const estimateChatTokenSize = (text: string) => {
  return enc.encode(text).length;
};

export default estimateChatTokenSize;
