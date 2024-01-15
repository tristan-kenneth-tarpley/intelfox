import summarizePricing from '@/lib/logic/aiCapabilities/summarizePricing';
import { useMutation } from '@tanstack/react-query';

const usePricingPageScraper = () => {
  return useMutation<string | null, null, string>({
    mutationFn: (input) => summarizePricing(input),
  });
};

export default usePricingPageScraper;
