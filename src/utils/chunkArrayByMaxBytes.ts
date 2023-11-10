// use sparingly... This is pretty inefficient due to all of the json.stringify calls
const chunkArrayByMaxBytes = <TItem>(array: TItem[], maxBytes: number) => {
  const chunks: TItem[][] = [];

  array.forEach((item) => {
    const itemSize = Buffer.byteLength(JSON.stringify(item));
    const lastChunk = chunks[chunks.length - 1];

    if (itemSize > maxBytes) {
      throw new Error(`No single item can be more than ${maxBytes} bytes.`);
    }

    if (!lastChunk) {
      chunks.push([item]);
      return;
    }

    const totalChunkSize = lastChunk.reduce((acc, x) => acc + Buffer.byteLength(JSON.stringify(x)), 0);

    if ((totalChunkSize + itemSize) <= maxBytes) {
      chunks[chunks.length - 1] = [...lastChunk, item];
      return;
    }

    chunks.push([item]);
  });

  return chunks;
};

export default chunkArrayByMaxBytes;
