import { unstable_noStore } from "next/cache";

const cacheHelpers = {
  noStore: unstable_noStore,
} as const;

export default cacheHelpers;
