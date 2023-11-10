import { encoding_for_model } from 'tiktoken';

const enc = encoding_for_model('text-embedding-ada-002');

const estimateEmbeddingsTokenSize = (text: string) => {
  return enc.encode(text).length;
};

export default estimateEmbeddingsTokenSize;
