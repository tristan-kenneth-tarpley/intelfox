import { encodingForModel } from 'js-tiktoken';

const enc = encodingForModel('text-embedding-ada-002');

const estimateEmbeddingsTokenSize = (text: string) => {
  return enc.encode(text).length;
};

export default estimateEmbeddingsTokenSize;
