import summarizePricing from "@/lib/logic/aiCapabilities/summarizePricing";
import { useMutation } from "@tanstack/react-query";

const usePricingPageScraper = ({
  onSuccess,
}: {
  onSuccess?: (data: string | null) => void;
} = {}) => {
  return useMutation<string | null, null, string>({
    mutationFn: (input) => summarizePricing(input),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
};

export default usePricingPageScraper;
