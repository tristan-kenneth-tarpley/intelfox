import { encoding_for_model } from 'tiktoken';

const estimateEmbeddingsTokenSize = (text: string) => {
  const enc = encoding_for_model('text-embedding-ada-002');
  return enc.encode(text).length;
};

export default estimateEmbeddingsTokenSize;
